module.exports.energyarchive = ['energyarchive_A+', 'energyarchive_A-', 'energyarchive_R+', 'energyarchive_R-']
module.exports.energytotal = ['current_energytotal_A+', 'current_energytotal_A-', 'current_energytotal_R+', 'current_energytotal_R-']
module.exports.energytotalTarif = [
    'current_energytotal_A+',
    "current_energytotal_A+_tarif1",
    "current_energytotal_A+_tarif2",
    "current_energytotal_A+_tarif3",
    "current_energytotal_A+_tarif4",
    'current_energytotal_A-',
    "current_energytotal_A-_tarif1",
    "current_energytotal_A-_tarif2",
    "current_energytotal_A-_tarif3",
    "current_energytotal_A-_tarif4",
    'current_energytotal_R+',
    "current_energytotal_R+_tarif1",
    "current_energytotal_R+_tarif2",
    "current_energytotal_R+_tarif3",
    "current_energytotal_R+_tarif4",
    'current_energytotal_R-',
    "current_energytotal_R-_tarif1",
    "current_energytotal_R-_tarif2",
    "current_energytotal_R-_tarif3",
    "current_energytotal_R-_tarif4",
]
module.exports.currentFindArchive = {
    'current_energytotal_A+': 'energyarchive_A+',
    'current_energytotal_A-': 'energyarchive_A-',
    'current_energytotal_R+': 'energyarchive_R+',
    'current_energytotal_R-': 'energyarchive_R-'
}
module.exports.energyarchive_obis = ["4.8.1", "4.8.2", "4.8.3", "4.8.4"]
module.exports.divisor10 = ["1.13.0", "1.13.1", "1.13.2", "1.13.3", "1.11.0", "1.11.1", "1.11.2"]
module.exports.energytotalOBIS = ["1.0.0", "1.1.0", "1.2.0", "1.3.0"]
module.exports.energytotalShortName = ["current_active-power_total", "current_reactive-power_total", "current_full-power_total", "current_coef-active-power_total"]
module.exports.realTimeVariable = ["current_active-power_total", "current_reactive-power_total", "current_full-power_total", "current_coef-active-power_total"]
module.exports.realTimeVariableTarif = {
    "current_active-power_total": "current_active-power_A", 
    "current_reactive-power_total": "current_reactive-power_A", 
    "current_full-power_total": "current_full-power_A", 
    "current_coef-active-power_total": "current_coef-active-power_A"
}

module.exports.vectorMultiplyTN = [
    'current_voltage_A',
    'current_voltage_B',
    'current_voltage_C',
    "current_voltage_line_A",
    "current_voltage_line_B",
    "current_voltage_line_C",
]
module.exports.vectorMultiplyTT = [
    'current_current_A',
    'current_current_B',
    'current_current_C'
]
module.exports.allMultiply = [
    "current_active-power_A",
    "current_active-power_B",
    "current_active-power_C",
    "current_active-power_total",
    "current_reactive-power_A",
    "current_reactive-power_B",
    "current_reactive-power_C",
    "current_reactive-power_total",
    "current_full-power_A",
    "current_full-power_B",
    "current_full-power_C",
    "current_full-power_total",
]

module.exports.allParametersWithType = (param) => {
    return {
        "current_energytotal_A+": param,
        "current_energytotal_A+_tarif1": param,
        "current_energytotal_A+_tarif2": param,
        "current_energytotal_A+_tarif3": param,
        "current_energytotal_A+_tarif4": param,
        "current_energytotal_A-": param,
        "current_energytotal_A-_tarif1": param,
        "current_energytotal_A-_tarif2": param,
        "current_energytotal_A-_tarif3": param,
        "current_energytotal_A-_tarif4": param,
        "current_energytotal_R+": param,
        "current_energytotal_R+_tarif1": param,
        "current_energytotal_R+_tarif2": param,
        "current_energytotal_R+_tarif3": param,
        "current_energytotal_R+_tarif4": param,
        "current_energytotal_R-": param,
        "current_energytotal_R-_tarif1": param,
        "current_energytotal_R-_tarif2": param,
        "current_energytotal_R-_tarif3": param,
        "current_energytotal_R-_tarif4": param,
        "current_voltage_A": param,
        "current_voltage_B": param,
        "current_voltage_C": param,
        "current_voltage_line_A": param,
        "current_voltage_line_B": param,
        "current_voltage_line_C": param,
        "current_frequency": param,
        "current_current_A": param,
        "current_current_B": param,
        "current_current_C": param,
        "current_active-power_A": param,
        "current_active-power_B": param,
        "current_active-power_C": param,
        "current_active-power_total": param,
        "current_reactive-power_A": param,
        "current_reactive-power_B": param,
        "current_reactive-power_C": param,
        "current_reactive-power_total": param,
        "current_full-power_A": param,
        "current_full-power_B": param,
        "current_full-power_C": param,
        "current_full-power_total": param,
        "current_angle_UI_A": param,
        "current_angle_UI_B": param,
        "current_angle_UI_C": param,
        "current_angle_phase_AB": param,
        "current_angle_phase_BC": param,
        "current_angle_phase_CA": param,
        "current_coef-active-power_A": param,
        "current_coef-active-power_B": param,
        "current_coef-active-power_C": param,
        "current_coef-active-power_total": param,
        "current_coef-reactive-power_A": param,
        "current_coef-reactive-power_B": param,
        "current_coef-reactive-power_C": param,
        "current_coef-reactive-power_total": param,
        'energyarchive_A+': param,
        'energyarchive_A-': param,
        'energyarchive_R+': param,
        'energyarchive_R-': param,
    }
}