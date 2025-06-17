// -- IMPORTS

import { getFloorInteger, getMapByCode, getRandomInteger, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { getIO } from '../../socket';
import { AppError } from '../errors/app_error';
import { initWbot } from '../../whatsapp_bot';
import { whatsappService } from './whatsapp_service';
import { whatsappBotManager } from './whatsapp_bot_manager';

// -- FUNCTIONS

class WhatsappBotService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
    }

    // -- INQUIRIES

    getRandomId(
        length
        )
    {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        let counter = 0;

        while ( counter < length )
        {
            result += characters.charAt( getFloorInteger( getRandomInteger() * charactersLength ) );
            counter += 1;
        }

        return result;
    }

    // -- OPERATIONS

    async startAllWhatsAppsSessions(
        )
    {
        let whatsappArray = await this.listWhatsAppsService();

        if ( whatsappArray.length > 0 )
        {
            for ( let whatsapp of whatsappArray )
            {
                this.startWhatsAppSession( whatsapp );
            }
        }
    }

    // ~~

    async startWhatsAppSession(
        whatsapp
        )
    {
        whatsapp = await whatsappService.setWhatsappById( { status: 'OPENING' }, whatsapp.id );

        let io = getIO();

        io.emit(
            'whatsappSession',
            {
                action: 'update',
                session: whatsapp
            }
            );
      
        try
        {
            const bot = await whatsappBotManager.getBotInstance(whatsapp.churchId);

            this.wbotMessageListener( bot );
            this.wbotMonitor( bot, whatsapp );
        }
        catch ( error )
        {
            logError( error );
        }
    }

    // ~~

    async wbotMessageListener(
        whatsappBot,
        whatsapp
        )
    {
        let io = getIO();

        whatsappBot.on(
            'message_create',
            async message =>
            {
                this.handleMessage( message, whatsappBot );
            }
            );

        whatsappBot.on(
            'media_uploaded',
            async message =>
            {
                this.handleMessage( message, whatsappBot );
            }
            );

        whatsappBot.on(
            'message_ack',
            async ( message, ack ) =>
            {
                this.handleMsgAck( message, ack );
            }
            );
    }

    // ~~


    async wbotMonitor(
        whatsappBot,
        whatsapp
        )
    {
        let io = getIO();
        let sessionName = whatsapp.name;
    
        try
        {
            whatsappBot.on(
                'change_state',
                async ( newState ) =>
                {
                    console.log( `Monitor session: ${ sessionName }, ${ newState }` );

                    try
                    {
                        await whatsappService.setWhatsappById( { status: newState }, whatsapp.id );
                    }
                    catch ( error )
                    {
                        logError( error );
                    }
  
                    io.emit(
                        'whatsappSession',
                        {
                            action: 'update',
                            session: whatsapp
                        }
                        );
                }
                );
        
            whatsappBot.on(
                'change_battery',
                async ( batteryInfo ) =>
                {
                    let { battery, plugged } = batteryInfo;
                    console.log(
                        `Battery session: ${ sessionName } ${ battery }% - Charging? ${ plugged }`
                        );
                    
                    try
                    {
                        await whatsappService.setWhatsappById( { battery, isPlugged: plugged }, whatsapp.id );
                    }
                    catch ( error )
                    {
                        logError( error );
                    }
  
                    io.emit(
                        'whatsappSession',
                        {
                            action: 'update',
                            session: whatsapp
                        }
                        );
                }
                );
            
            whatsappBot.on(
                'disconnected',
                async ( reason ) =>
                {
                    console.log( `Disconnected session: ${ sessionName }, reason: ${ reason }` );

                    try
                    {
                        await whatsappService.setWhatsappById( { status: 'OPENING', session: '' }, whatsapp.id );
                    }
                    catch ( error )
                    {
                        console.log.error( error );
                    }
            
                    io.emit(
                        'whatsappSession', 
                        {
                            action: 'update',
                            session: whatsapp
                        }
                        );
            
                    setTimeout( () => this.startWhatsAppSession( whatsapp ), 2000 );
                }
                );
        }
        catch ( error )
        {
            logError( error );
        }
    }

    // ~~

    async verifyContact(
        messageContact
        )
    {
        let profilePicUrl = await messageContact.getProfilePicUrl();
      
        let contactData =
            {
                name: messageContact.name || messageContact.pushname || messageContact.id.user,
                number: messageContact.id.user,
                profilePicUrl,
                isGroup: messageContact.isGroup
            };
      
        let contact = this.createOrUpdateContactService( contactData );
      
        return contact;
    }

    // ~~

    async verifyQuotedMessage(
        message
        )
    {
        if ( !message.hasQuotedMsg ) return null;
      
        let whatsappBotQuotedMessage = await message.getQuotedMessage();
      
        let quotedMessage = await Message.findOne(
            {
                where: { id: whatsappBotQuotedMessage.id.id }
            }
            );
      
        if ( !quotedMessage ) return null;
      
        return quotedMessage;
    }

    // ~~

    async verifyMediaMessage(
        message,
        ticket,
        contact
        )
    {
        let quotedMessage = await this.verifyQuotedMessage( message );
      
        const media = await msg.downloadMedia();
      
        if (!media) {
          throw new AppError( 'ERR_WAPP_DOWNLOAD_MEDIA' );
        }
      
        let randomId = this.getRandomId( 5 );
      
        if ( !media.filename )
        {
            let fileExtension = media.mimetype.split( '/' )[ 1 ].split( ';' )[ 0 ];
            media.filename = `${ randomId }-${ new Date().getTime() }.${ fileExtension }`;
        }
        else
        {
            media.filename = media.filename.split( '.' ).slice( 0, -1 ).join( '.' ) + '.' + randomId + '.' + media.filename.split( '.' ).slice( -1 );
        }
      
        try
        {
            await writeFileAsync(
                join( __dirname, '..', '..', '..', 'public', media.filename ),
                media.data,
                'base64'
                );
        }
        catch ( error )
        {
            logError( error );
        }
      
        let messageData =
            {
                id: message.id.id,
                ticketId: ticket.id,
                contactId: message.fromMe ? undefined : contact.id,
                body: message.body || media.filename,
                fromMe: message.fromMe,
                read: message.fromMe,
                mediaUrl: media.filename,
                mediaType: media.mimetype.split( '/' )[ 0 ],
                quotedMsgId: quotedMessage?.id
            };
      
        await ticket.update( { lastMessage: message.body || media.filename } );
        let newMessage = await this.createMessageService( { messageData } );
      
        return newMessage;
    }

    // ~~

    async verifyMessage(
        message,
        ticket,
        contact
        )
    {
      
        if ( message.type === 'location' )
            message = this.prepareLocation( message );
      
        let quotedMessage = await verifyQuotedMessage( message );
        let messageData =
            {
                id: message.id.id,
                ticketId: ticket.id,
                contactId: message.fromMe ? undefined : contact.id,
                body: message.body,
                fromMe: message.fromMe,
                mediaType: message.type,
                read: message.fromMe,
                quotedMsgId: quotedMessage?.id
            };
      
        await ticket.update(
            {
                lastMessage: message.type === 'location'
                    ? msg.location.description
                        ? 'Localization - ' + message.location.description.split( '\\n' )[ 0 ]
                        : 'Localization'
                    : message.body
            }
            );
      
        await this.createMessageService( { messageData } );
    }

    // ~~

    prepareLocation(
        message
        )
    {
        let gmapsUrl = 'https://maps.google.com/maps?q=' + message.location.latitude + '%2C' + message.location.longitude + '&z=17&hl=pt-BR';
      
        message.body = 'data:image/png;base64,' + message.body + '|' + gmapsUrl;

        message.body += '|' + ( message.location.description ? message.location.description : ( message.location.latitude + ', ' + message.location.longitude ) )
      
        return message;
    }

    // ~~

    async verifyQueue(
        whatsappBot,
        message,
        ticket,
        contact
        )
    {
        let { queues, greetingMessage } = await ShowWhatsAppService( whatsappBot.id );
      
        if ( queues.length === 1 )
        {
            await this.updateTicketService(
                {
                    ticketData: { queueId: queues[ 0 ].id },
                    ticketId: ticket.id
                }
                );
        
            return;
        }
      
        let selectedOption = message.body;
        let choosenQueue = queues[ +selectedOption - 1 ];
      
        if ( choosenQueue )
        {
            await this.updateTicketService(
                {
                    ticketData: { queueId: choosenQueue.id },
                    ticketId: ticket.id
                }
                );
      
            let body = formatBody( `\u200e${ choosenQueue.greetingMessage }`, contact );
        
            let sentMessage = await whatsappBot.sendMessage( `${ contact.number }@c.us`, body );
        
            await this.verifyMessage( sentMessage, ticket, contact );
        }
        else
        {
            let options = '';
        
            queues.forEach(
                ( queue, index ) =>
                {
                    options += `*${ index + 1 }* - ${ queue.name }\n`;
                }
                );
        
            let body = formatBody( `\u200e${ greetingMessage }\n${ options }`, contact );
        
            let debouncedSentMessage = debounce(
                async () => {
                let sentMessage = await wbot.sendMessage(
                    `${contact.number}@c.us`,
                    body
                );
                this.verifyMessage( sentMessage, ticket, contact );
                },
                3000,
                ticket.id
            );
        
            debouncedSentMessage();
        }
    }
      
    // ~~

    isValidMessage(
        message
        )
    {
        if ( message.from === 'status@broadcast' ) return false;
        if ( message.type === 'chat'
             || message.type === 'audio'
             || message.type === 'ptt'
             || message.type === 'video'
             || message.type === 'image'
             || message.type === 'document'
             || message.type === 'vcard'
             // || message.type === 'multi_vcard'
             || message.type === 'sticker'
             || message.type === 'location' )
        {
            return true;
        }

        return false;
    }

    // ~~

    async handleMessage(
        message,
        whatsappBot
        )
    {
        if ( !this.isValidMessage( message ) )
        {
            return;
        }
      
        try
        {
            let messageContact;
            let groupContact;
        
            if ( message.fromMe )
            {
                if ( /\u200e/.test( message.body[ 0 ] ) ) return;
        
                if ( !message.hasMedia
                     && message.type !== 'location'
                     && message.type !== 'chat'
                     && message.type !== 'vcard' ) return;
        
                messageContact = await whatsappBot.getContactById( message.to );
            }
            else
            {
                messageContact = await message.getContact();
            }
        
            let chat = await message.getChat();
        
            if ( chat.isGroup )
            {
                let messageGroupContact;
        
                if ( message.fromMe )
                {
                    messageGroupContact = await whatsappBot.getContactById( message.to );
                }
                else
                {
                    messageGroupContact = await whatsappBot.getContactById( message.from );
                }
        
                groupContact = await this.verifyContact( messageGroupContact );
            }

            let whatsapp = await this.showWhatsAppService( whatsappBot.id );
            let unreadMessages = message.fromMe ? 0 : chat.unreadCount;
            let contact = await this.verifyContact( messageContact );
        
            if ( unreadMessages === 0
                 && whatsapp.farewellMessage
                 && this.formatBody( whatsapp.farewellMessage, contact ) === message.body ) return;
        
            let ticket = await this.findOrCreateTicketService(
                contact,
                whatsappBot.id,
                unreadMessages,
                groupContact
                );
        
            if ( message.hasMedia )
            {
                await this.verifyMediaMessage( message, ticket, contact );
            }
            else
            {
                await this.verifyMessage( message, ticket, contact );
            }
        
            if ( !ticket.queue
                 && !chat.isGroup
                 && !message.fromMe
                 && !ticket.userId
                 && whatsapp.queues.length >= 1 )
            {
                await this.verifyQueue( whatsappBot, message, ticket, contact );
            }
        
            if ( message.type === 'vcard')
            {
                try
                {
                    let array = message.body.split( '\n' );
                    let obj = [];
                    let contact = '';

                    for ( let index = 0; index < array.length; index++ ) 
                    {
                        let v = array[ index ];
                        let values = v.split( ':' );

                        for ( let ind = 0; ind < values.length; ind++ )
                        {
                            if ( values[ ind ].indexOf( '+' ) !== -1 )
                            {
                                obj.push( { number: values[ ind ] } );
                            }

                            if ( values[ ind ].indexOf( 'FN' ) !== -1 )
                            {
                                contact = values[ ind +  1];
                            }
                        }
                    }

                    for await ( let ob of obj )
                    {
                        let cont = await this.createContactService(
                            {
                                name: contact,
                                number: ob.number.replace( /\D/g, '' )
                            }
                            );
                    }
                }
                catch ( error )
                {
                    logError( error );
                }
            }
        
            /* if (msg.type === 'multi_vcard') {
                try {
                const array = msg.vCards.toString().split('\n');
                let name = ';
                let number = ';
                const obj = [];
                const conts = [];
                for (let index = 0; index < array.length; index++) {
                    const v = array[index];
                    const values = v.split(':');
                    for (let ind = 0; ind < values.length; ind++) {
                    if (values[ind].indexOf('+') !== -1) {
                        number = values[ind];
                    }
                    if (values[ind].indexOf('FN') !== -1) {
                        name = values[ind + 1];
                    }
                    if (name !== ' && number !== ') {
                        obj.push({
                        name,
                        number
                        });
                        name = ';
                        number = ';
                    }
                    }
                }
        
                // eslint-disable-next-line no-restricted-syntax
                for await (const ob of obj) {
                    try {
                    const cont = await CreateContactService({
                        name: ob.name,
                        number: ob.number.replace(/\D/g, ')
                    });
                    conts.push({
                        id: cont.id,
                        name: cont.name,
                        number: cont.number
                    });
                    } catch (error) {
                    if (error.message === 'ERR_DUPLICATED_CONTACT') {
                        const cont = await GetContactService({
                        name: ob.name,
                        number: ob.number.replace(/\D/g, '),
                        email: '
                        });
                        conts.push({
                        id: cont.id,
                        name: cont.name,
                        number: cont.number
                        });
                    }
                    }
                }
                msg.body = JSON.stringify(conts);
                } catch (error) {
                console.log(error);
                }
            } */
        }
        catch ( error )
        {
            logError( `Error handling whatsapp message: Err: ${ error }` );
        }
    }

    // ~~

    async listWhatsAppsService(
        )
    {
        let { data, error } = await databaseService
            .getClient()
            .from( 'WHATSAPP' )
            .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let whatsappBotService
    = new WhatsappBotService();
