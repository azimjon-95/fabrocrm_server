class ResponseHandler {
    static messages = {
        usersList: "Foydalanuvchilar ro‘yxati",
        userCreated: "Foydalanuvchi muvaffaqiyatli yaratildi",
        userExists: "Bu telefon raqami allaqachon ro‘yxatdan o‘tgan",
        userCreateError: "Foydalanuvchi yaratishda xatolik",
        loginSuccess: "Tizimga muvaffaqiyatli kirdingiz",
        loginError: "Telefon raqam yoki parol noto‘g‘ri",
        fetchError: "Ma'lumotlarni olishda xatolik",
        userNotFound: "Foydalanuvchi topilmadi",
        userFound: "Foydalanuvchi topildi",
        userUpdated: "Foydalanuvchi muvaffaqiyatli yangilandi",
        userDeleted: "Foydalanuvchi muvaffaqiyatli o‘chirildi",
    };

    static statusCodes = {
        success: 200,
        created: 201,
        badRequest: 400,
        unauthorized: 401,
        serverError: 500,
    };

    static handleResponse(res, status, messageKey, data = null) {
        const message = this.messages[messageKey] || "Xatolik yuz berdi";
        res.status(status).json({ status: status < 400 ? "success" : "error", message, data });
    }

    static success(res, messageKey, data = null) {
        this.handleResponse(res, this.statusCodes.success, messageKey, data);
    }

    static created(res, messageKey, data = null) {
        this.handleResponse(res, this.statusCodes.created, messageKey, data);
    }

    static error(res, messageKey, statusCode = this.statusCodes.badRequest) {
        this.handleResponse(res, statusCode, messageKey);
    }
}

module.exports = ResponseHandler;
