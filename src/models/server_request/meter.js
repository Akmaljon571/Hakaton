const mongoose = require("mongoose")
const { meter_form, period_type, attachedEnum, baudRateEnum, parityEnum, stopBitEnum, dataBitEnum } = require("../../global/enum")
const { meterListReadFile } = require("../../global/meter-list")

const meterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    meter_type: {
        type: String,
        enum: Object.keys(meterListReadFile())
    },
    protokol: String,
    meter_form: {
        type: String,
        enum: meter_form
    },
    number_meter: {
        type: String
    },
    connection_address: {
        type: String
    },
    password: {
        type: String
    },
    connection_channel: {
        type: String,
        enum: attachedEnum,
        require: true
    },
    ip_address: {
        type: String
    },
    port: {
        type: String
    },
    comport: {
        type: String
    },
    baud_rate: {
        type: String,
        enum: baudRateEnum
    },
    parity: {
        type: String,
        enum: parityEnum
    },
    stop_bit: {
        type: String,
        enum: stopBitEnum
    },
    data_bit: {
        type: String,
        enum: dataBitEnum
    },
    waiting_time: {
        type: Number
    },
    interval_time: {
        type: Number
    },
    pause_time: {
        type: Number
    },
    package_size: {
        type: Number
    },
    init_line: {
        type: String
    },
    modem_phone: {
        type: String
    },
    modem_command: {
        type: String
    },
    period_type: {
        type: String,
        enum: period_type
    },
    days_of_month: {
        type: [Number]
    },
    days_of_week: {
        type: [Number]
    },
    hours_of_day: {
        type: [{ hour: Number, minutes: [Number] }],
        default: []
    },
    data_polling_length: {
        type: String
    },
    data_refresh_length: {
        type: Number
    },
    parameterIds: {
        type: [String]
    },
    time_difference: {
        type: Number
    }
})

module.exports.meterModel = mongoose.model("meter", meterSchema)
