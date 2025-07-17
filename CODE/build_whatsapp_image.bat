@echo off
echo Construindo imagem Docker do WhatsApp Manager...

cd CODE\whatsapp_manager

echo Construindo imagem zapbless-whatsapp-manager:latest...
docker build -t zapbless-whatsapp-manager:latest .

if %ERRORLEVEL% EQU 0 (
    echo Imagem construída com sucesso!
    echo.
    echo Para testar, execute:
    echo docker run -d --name test-whatsapp -p 3001:3000 -e CHURCH_ID=test123 zapbless-whatsapp-manager:latest
) else (
    echo Erro ao construir a imagem!
)

cd ..\.. 