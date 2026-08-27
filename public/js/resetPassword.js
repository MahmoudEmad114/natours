import axios from 'axios'
import { showAlert } from './alerts'

export const resetPassword = async (password, passwordConfirm) => {
    try {
        const token = window.location.pathname.split('/').pop();
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/users/resetPassword/${token}`,
            data: {
                password,
                passwordConfirm
            }
        })

        if (res.data.status === 'success') {
            showAlert('success', 'Password reset successfully!')
            window.setTimeout(() => {
                location.assign('/login')
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}