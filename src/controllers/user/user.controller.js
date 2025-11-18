import fetchUserService from "../../services/user/user.service.js"

const userController = {}

userController.fetchUserData = async (req, res) => {
    const data = await fetchUserService.fetchUser()
    res.status(200).json({ sucess: true, data })
}

export default userController