const createDateAddDaysFromNow = (days) => {
    const date = new Date()

    date.setDate(date.getDate() + days)

    return date
}

const createDateNow = () => {
    const date = new Date()

    return date
}

module.exports = {createDateAddDaysFromNow, createDateNow}