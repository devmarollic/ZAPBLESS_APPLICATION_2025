// -- IMPORTS

import { updatePasswordUseCase } from '../../../lib/use_case/update_password_use_case';
import { authentificationService } from '../../../lib/service/authentification_service';

jest.mock('../../../lib/service/authentification_service');

describe('updatePasswordUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve atualizar a senha com sucesso', async () => {
        authentificationService.updateUserPassword.mockResolvedValueOnce({});
        await expect(updatePasswordUseCase.execute({ accessToken: 'validtoken123', newPassword: 'newpass123' })).resolves.toBeDefined();
        expect(authentificationService.updateUserPassword).toHaveBeenCalledWith('validtoken123', 'newpass123');
    });

    it('deve lançar erro para senha inválida', async () => {
        await expect(updatePasswordUseCase.execute({ accessToken: 'validtoken123', newPassword: '123' })).rejects.toThrow();
        expect(authentificationService.updateUserPassword).not.toHaveBeenCalled();
    });

    it('deve lançar erro se o serviço falhar', async () => {
        authentificationService.updateUserPassword.mockRejectedValueOnce(new Error('Service error'));
        await expect(updatePasswordUseCase.execute({ accessToken: 'validtoken123', newPassword: 'newpass123' })).rejects.toThrow('Service error');
    });
});
