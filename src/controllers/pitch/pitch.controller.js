import pitchService from "../../services/pitch/ptich.service.js"

const pitchController = {}

pitchController.create = async (req, res) => {
    const { name, type, hourlyRate, status } = req.body
    const addedByAdminId = req.userId
    const newPitch = await pitchService.create(name, type, hourlyRate, status, addedByAdminId)

    res.status(201).json({ message: 'create success', newPitch })
}

pitchController.getAll = async (req, res) => {
    const data = await pitchService.getAll()
    res.status(200).json({ data })
}

pitchController.getById = async (req, res) => {
    const pitchId = req.params.id
    const data = await pitchService.getById(pitchId)

    res.status(200).json({ data })
}

pitchController.updateData = async (req, res) => {
    const pitchId = req.params.id

    const { name, type, hourlyRate } = req.body

    const dataUpdated = await pitchService.updateData(pitchId, name, type, hourlyRate)

    res.status(203).json({ message: 'Update success!', data: dataUpdated })

}

pitchController.updateStatus = async (req, res) => {
    const pitchId = req.params.id
    const { status } = req.body
    const statusUpdated = await pitchService.updateStatus(pitchId, status)
    res.status(203).json({ message: 'updated success', statusUpdated })

}

pitchController.delete = async (req, res) => {
    const pitchId = req.params.id
    await pitchService.delete(pitchId)
    res.status(204)
}

export default pitchController