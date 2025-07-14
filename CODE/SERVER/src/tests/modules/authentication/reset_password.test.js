// -- IMPORTS

import { resetPasswordUseCase } from '../../../lib/use_case/reset_password_use_case';
import { authentificationService } from '../../../lib/service/authentification_service';

jest.mock('../../../lib/service/authentification_service');

describe('resetPasswordUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve enviar e-mail de reset de senha com sucesso', async () => {
        authentificationService.resetPasswordForEmail.mockResolvedValueOnce({});
        await expect(resetPasswordUseCase.execute({ email: 'user@example.com' })).resolves.toBeDefined();
        expect(authentificationService.resetPasswordForEmail).toHaveBeenCalledWith('user@example.com');
    });

    it('deve lançar erro para e-mail inválido', async () => {
        await expect(resetPasswordUseCase.execute({ email: 'invalid' })).rejects.toThrow();
        expect(authentificationService.resetPasswordForEmail).not.toHaveBeenCalled();
    });

    it('deve lançar erro se o serviço falhar', async () => {
        authentificationService.resetPasswordForEmail.mockRejectedValueOnce(new Error('Service error'));
        await expect(resetPasswordUseCase.execute({ email: 'user@example.com' })).rejects.toThrow('Service error');
    });
});
