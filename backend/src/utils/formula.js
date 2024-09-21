module.exports.formula = (short_names) => {
    try {
        if (short_names && (short_names["current_coef-active-power_A"] == undefined || short_names["current_coef-active-power_A"] == "Empty") && ((short_names["current_angle_UI_A"] != undefined))) {
            short_names["current_coef-active-power_A"] =
            {
                value: (Math.cos(short_names["current_angle_UI_A"]?.value * Math.PI / 180))
            }

        }
        if (short_names && (short_names["current_coef-active-power_B"] == undefined || short_names["current_coef-active-power_B"] == "Empty") && ((short_names["current_angle_UI_B"] != undefined))) {
            short_names["current_coef-active-power_B"] =
            {
                value: (Math.cos(short_names["current_angle_UI_B"]?.value * Math.PI / 180))
            }
        }
        if (short_names && (short_names["current_coef-active-power_C"] == undefined || short_names["current_coef-active-power_C"] == "Empty") && ((short_names["current_angle_UI_C"] != undefined))) {
            short_names["current_coef-active-power_C"] =
            {
                value: (Math.cos(short_names["current_angle_UI_C"]?.value * Math.PI / 180))
            }
        }
        if (short_names && (short_names["current_coef-active-power_total"] == undefined || short_names["current_coef-active-power_total"] == "Empty") && ((short_names["current_coef-active-power_A"] != undefined) || (short_names["current_coef-active-power_B"] != undefined) || (short_names["current_coef-active-power_C"] != undefined))) {
            short_names = {
                ...short_names,
                ["current_coef-active-power_total"]: {
                    value: (((short_names["current_coef-active-power_A"] ? short_names["current_coef-active-power_A"]?.value : 0) +
                        (short_names["current_coef-active-power_B"] ? short_names["current_coef-active-power_B"]?.value : 0) +
                        (typeof short_names["current_coef-active-power_C"] == 'object' && "value" in short_names["current_coef-active-power_C"] ? short_names["current_coef-active-power_C"]?.value : 0)) / 3)
                }
            }
        }
        if (short_names && (short_names["current_sinusf-reactive-power_A"] == undefined || short_names["current_sinusf-reactive-power_A"] == "Empty") && ((short_names["current_angle_UI_A"] != undefined))) {
            short_names["current_sinusf-reactive-power_A"] =
            {
                value: (Math.sin(short_names["current_angle_UI_A"]?.value * Math.PI / 180))
            }
        }
        if (short_names && (short_names["current_sinusf-reactive-power_B"] == undefined || short_names["current_sinusf-reactive-power_B"] == "Empty") && ((short_names["current_angle_UI_B"] != undefined))) {
            short_names["current_sinusf-reactive-power_B"] =
            {
                value: (Math.sin(short_names["current_angle_UI_B"]?.value * Math.PI / 180))
            }
        }
        if (short_names && (short_names["current_sinusf-reactive-power_C"] == undefined || short_names["current_sinusf-reactive-power_C"] == "Empty") && ((short_names["current_angle_UI_C"] != undefined))) {
            short_names["current_sinusf-reactive-power_C"] =
            {
                value: (Math.sin(short_names["current_angle_UI_C"]?.value * Math.PI / 180))
            }
        }
        if (short_names && (short_names["current_sinusf-reactive-power_total"] == undefined || short_names["current_sinusf-reactive-power_total"] == "Empty") && ((short_names["current_sinusf-reactive-power_A"] != undefined) || (short_names["current_sinusf-reactive-power_B"] != undefined) || (short_names["current_sinusf-reactive-power_C"] != undefined))) {
            short_names = {
                ...short_names,
                ["current_sinusf-reactive-power_total"]: {
                    value: (((short_names["current_sinusf-reactive-power_A"] ? short_names["current_sinusf-reactive-power_A"]?.value : 0) +
                        (short_names["current_sinusf-reactive-power_B"] ? short_names["current_sinusf-reactive-power_B"]?.value : 0) +
                        (short_names["current_sinusf-reactive-power_C"] ? short_names["current_sinusf-reactive-power_C"]?.value : 0)) / 3)
                }
            }
        }
        if (short_names && (short_names["current_full-power_A"] == undefined || short_names["current_full-power_A"] == "Empty") && ((short_names["current_voltage_A"] != undefined) && (short_names["current_current_A"] != undefined))) {
            short_names["current_full-power_A"] =
            {
                value: ((short_names["current_voltage_A"]?.value) * (short_names["current_current_A"]?.value)) / 1000
            }
        }
        if (short_names && (short_names["current_full-power_B"] == undefined || short_names["current_full-power_B"] == "Empty") && ((short_names["current_voltage_B"] != undefined) && (short_names["current_current_B"] != undefined))) {
            short_names["current_full-power_B"] =
            {
                value: ((short_names["current_voltage_B"]?.value) * (short_names["current_current_B"]?.value)) / 1000
            }
        }
        if (short_names && (short_names["current_full-power_C"] == undefined || short_names["current_full-power_C"] == "Empty") && ((short_names["current_voltage_C"] != undefined) && (short_names["current_current_C"] != undefined))) {
            short_names["current_full-power_C"] =
            {
                value: ((short_names["current_voltage_C"]?.value) * (short_names["current_current_C"]?.value)) / 1000
            }
        }
        if (short_names && (short_names["current_full-power_total"] == undefined || short_names["current_full-power_total"] == "Empty") && (short_names["current_full-power_A"] != undefined || short_names["current_full-power_B"] != undefined || short_names["current_full-power_C"] != undefined)) {
            short_names = {
                ...short_names,
                ["current_full-power_total"]: {
                    value: ((short_names["current_full-power_A"]?.value || 0) + (short_names["current_full-power_B"]?.value || 0) + (short_names["current_full-power_C"]?.value || 0))
                }
            }
        }
        if (short_names && (short_names["current_active-power_A"] == undefined || short_names["current_active-power_A"] == "Empty") && ((short_names["current_voltage_A"] != undefined) && (short_names["current_current_A"] != undefined) && (short_names["current_coef-active-power_A"] != undefined))) {
            short_names["current_active-power_A"] =
            {
                value: ((short_names["current_voltage_A"]?.value) * (short_names["current_current_A"]?.value) * (short_names["current_coef-active-power_A"]?.value)) / 1000
            }
        }
        if (short_names && (short_names["current_active-power_B"] == undefined || short_names["current_active-power_B"] == "Empty") && ((short_names["current_voltage_B"] != undefined) && (short_names["current_current_B"] != undefined) && (short_names["current_coef-active-power_B"] != undefined))) {
            short_names["current_active-power_B"] =
            {
                value: ((short_names["current_voltage_B"]?.value) * (short_names["current_current_B"]?.value) * (short_names["current_coef-active-power_B"]?.value)) / 1000
            }
        }
        if (short_names && (short_names["current_active-power_C"] == undefined || short_names["current_active-power_C"] == "Empty") && ((short_names["current_voltage_C"] != undefined) && (short_names["current_current_C"] != undefined) && (short_names["current_coef-active-power_C"] != undefined))) {
            short_names["current_active-power_C"] =
            {
                value: ((short_names["current_voltage_C"]?.value) * (short_names["current_current_C"]?.value) * (short_names["current_coef-active-power_C"]?.value)) / 1000
            }
        }
        if (short_names && (short_names["current_active-power_total"] == undefined || short_names["current_active-power_total"] == "Empty") && (short_names["current_active-power_A"] != undefined || short_names["current_active-power_B"] != undefined || short_names["current_active-power_C"] != undefined)) {
            short_names = {
                ...short_names,
                ["current_active-power_total"]:
                    { value: ((short_names["current_active-power_A"] ? short_names["current_active-power_A"]?.value : 0) + (short_names["current_active-power_B"] ? short_names["current_active-power_B"]?.value : 0) + (short_names["current_active-power_C"] ? short_names["current_active-power_C"]?.value : 0)) }
            }
        }

        if (short_names && (short_names["current_voltage_line_A"] == undefined || short_names["current_voltage_line_A"] == "Empty") && (short_names["current_voltage_A"] != undefined)) {
            short_names["current_voltage_line_A"] = { value: ((short_names["current_voltage_A"]?.value) * Math.sqrt(3)) }
        }

        if (short_names && (short_names["current_voltage_line_B"] == undefined || short_names["current_voltage_line_B"] == "Empty") && (short_names["current_voltage_B"] != undefined)) {
            short_names["current_voltage_line_B"] = { value: ((short_names["current_voltage_B"]?.value) * Math.sqrt(3)) }
        }

        if (short_names && (short_names["current_voltage_line_C"] == undefined || short_names["current_voltage_line_C"] == "Empty") && (short_names["current_voltage_C"] != undefined)) {
            short_names["current_voltage_line_C"] = { value: ((short_names["current_voltage_C"]?.value) * Math.sqrt(3)) }
        }

        if (short_names && (short_names["current_reactive-power_A"] == undefined || short_names["current_reactive-power_A"] == "Empty") && ((short_names["current_voltage_A"] != undefined) && (short_names["current_current_A"] != undefined) && (short_names["current_coef-active-power_A"] != undefined))) {
            short_names["current_reactive-power_A"] = { value: ((short_names["current_voltage_A"]?.value) * (short_names["current_current_A"]?.value) * (short_names["current_sinusf-reactive-power_A"]?.value)) / 1000 }
        }
        if (short_names && (short_names["current_reactive-power_B"] == undefined || short_names["current_reactive-power_B"] == "Empty") && ((short_names["current_voltage_B"] != undefined) && (short_names["current_current_B"] != undefined) && (short_names["current_coef-active-power_B"] != undefined))) {
            short_names["current_reactive-power_B"] = { value: ((short_names["current_voltage_B"]?.value) * (short_names["current_current_B"]?.value) * (short_names["current_sinusf-reactive-power_B"]?.value)) / 1000 }
        }
        if (short_names && (short_names["current_reactive-power_C"] == undefined || short_names["current_reactive-power_C"] == "Empty") && ((short_names["current_voltage_C"] != undefined) && (short_names["current_current_C"] != undefined) && (short_names["current_coef-active-power_C"] != undefined))) {
            short_names["current_reactive-power_C"] = { value: ((short_names["current_voltage_C"]?.value) * (short_names["current_current_C"]?.value) * (short_names["current_sinusf-reactive-power_C"]?.value)) / 1000 }
        }
        if (short_names && (short_names["current_reactive-power_total"] == undefined || short_names["current_reactive-power_total"] == "Empty") && (((short_names["current_reactive-power_A"]) != undefined) || ((short_names["current_reactive-power_B"]) != undefined) || ((short_names["current_reactive-power_C"]) != undefined))) {
            short_names = {
                ...short_names,
                ["current_reactive-power_total"]: {
                    value: ((short_names["current_reactive-power_A"] ? short_names["current_reactive-power_A"]?.value : 0) +
                        (short_names["current_reactive-power_B"] ? short_names["current_reactive-power_B"]?.value : 0) +
                        (short_names["current_reactive-power_C"] ? short_names["current_reactive-power_C"]?.value : 0))
                }
            }
        }
        if ((short_names["current_angle_UI_A"] != undefined)) {
            if (short_names && (short_names["current_coef-reactive-power_A"] == undefined || short_names["current_coef-reactive-power_A"] == "Empty")) {
                short_names = {
                    ...short_names,
                    ["current_coef-reactive-power_A"]: {
                        value: (Math.tan(short_names["current_angle_UI_A"]?.value * Math.PI / 180))
                    }
                }
            }
        } else {
            if (short_names && (short_names["current_coef-reactive-power_A"] == undefined || short_names["current_coef-reactive-power_A"] == "Empty") && (short_names["current_coef-active-power_A"] != undefined)) {
                if ((short_names["current_coef-active-power_A"]?.value) != 0) {
                    if ((1 / (short_names["current_coef-active-power_A"]?.value) ** 2) >= 1) {
                        short_names = {
                            ...short_names,
                            ["current_coef-reactive-power_A"]: {
                                value: Math.sqrt((1 / ((short_names["current_coef-active-power_A"]?.value) ** 2)) - 1)
                            }
                        }
                    }
                }
            }
        }

        if ((short_names["current_angle_UI_B"] != undefined)) {
            if (short_names && (short_names["current_coef-reactive-power_B"] == undefined || short_names["current_reactive-power_B"] == "Empty")) {
                short_names = {
                    ...short_names,
                    ["current_coef-reactive-power_B"]: {
                        value: (Math.tan(short_names["current_angle_UI_B"]?.value * Math.PI / 180))
                    }
                }

            }
        } else {
            if (short_names && (short_names["current_coef-reactive-power_B"] == undefined || short_names["current_reactive-power_B"] == "Empty") && (short_names["current_coef-active-power_B"] != undefined)) {
                if ((short_names["current_coef-active-power_B"]?.value) != 0) {
                    if ((1 / (short_names["current_coef-active-power_B"]?.value) ** 2) >= 1) {
                        short_names = {
                            ...short_names,
                            ["current_coef-reactive-power_B"]: {
                                value: Math.sqrt((1 / ((short_names["current_coef-active-power_B"]?.value) ** 2)) - 1)
                            }

                        }
                    }
                }
            }
        }

        if ((short_names["current_angle_UI_C"] != undefined)) {
            if (short_names && (short_names["current_coef-reactive-power_C"] == undefined || short_names["current_sinusf-reactive-power_C"] == "Empty")) {
                short_names = {
                    ...short_names,
                    ["current_coef-reactive-power_C"]: {
                        value: (Math.tan(short_names["current_angle_UI_C"]?.value * Math.PI / 180))
                    }

                }
            }
        } else {
            if (short_names && (short_names["current_coef-reactive-power_C"] == undefined || short_names["current_sinusf-reactive-power_C"] == "Empty") && (short_names["current_coef-active-power_C"] != undefined)) {
                if ((short_names["current_coef-active-power_C"]?.value) != 0) {
                    if ((1 / (short_names["current_coef-active-power_C"]?.value) ** 2) >= 1) {
                        short_names = {
                            ...short_names,
                            ["current_coef-reactive-power_C"]: {
                                value: Math.sqrt((1 / ((short_names["current_coef-active-power_C"]?.value) ** 2)) - 1)
                            }
                        }
                    }
                }
            }
        }
        if (short_names && (short_names["current_coef-reactive-power_total"] == undefined || short_names["current_coef-reactive-power_total"] == "Empty") && (((short_names["current_coef-reactive-power_A"]) != undefined) || ((short_names["current_coef-reactive-power_B"]) != undefined) || ((short_names["current_coef-reactive-power_C"]) != undefined))) {
            short_names = {
                ...short_names,
                ["current_coef-reactive-power_total"]: {
                    value: ((short_names["current_coef-reactive-power_A"]?.value || 0) + (short_names["current_coef-reactive-power_B"]?.value || 0) + (short_names["current_coef-reactive-power_C"]?.value || 0)) / 3
                }
            }
        }
        if (short_names['current_angle_UI_A'] == undefined) {
            let catA = 0;
            let angleA;
            let signOfPA;
            let signOfQA;
            if (short_names != null && short_names['current_voltage_A'] != null && short_names['current_voltage_A'] != undefined && short_names['current_current_A'] != null && short_names['current_current_A'] != undefined && short_names['current_coef-active-power_A'] != null && short_names['current_coef-active-power_A'] != undefined) {
                signOfPA = Math.sign(short_names['current_voltage_A'].value * short_names['current_current_A'].value * short_names['current_coef-active-power_A'].value)
            }
            if (short_names['current_voltage_A'] != null && short_names['current_voltage_A'] != undefined && short_names['current_coef-active-power_A'] != null && short_names['current_coef-active-power_A'] != undefined && short_names['current_current_A'] != null && short_names['current_current_A'] != undefined) {
                signOfQA = Math.sign(short_names['current_voltage_A'].value * short_names['current_current_A'].value * Math.sqrt(1 - (short_names['current_coef-active-power_A'].value * short_names['current_coef-active-power_A'].value)))
            }
            if (short_names != null && short_names['current_coef-active-power_A'] != undefined && short_names['current_coef-active-power_A'] != null) {
                catA = short_names['current_coef-active-power_A'].value
                if (signOfPA > 0 && signOfQA > 0) {
                    angleA = (Math.acos(catA) * 180 / Math.PI) + 0
                }
                else if (signOfPA < 0 && signOfQA > 0) {
                    angleA = (Math.acos(catA) * 180 / Math.PI) + 0
                }
                else if (signOfPA < 0 && signOfQA < 0) {
                    angleA = Math.abs(360 - (Math.acos(catA) * 180 / Math.PI)) + 0
                }
                else if (signOfPA > 0 && signOfQA < 0) {
                    angleA = Math.abs(360 - (Math.acos(catA) * 180 / Math.PI)) + 0
                }
                if ((short_names != null) && (angleA)) {
                    short_names['current_angle_UI_A'] = { value: angleA.toFixed(2).toString() }
                }
            }
        }
        if (short_names['current_angle_UI_B'] == undefined) {
            let catB = 0;
            let angleB;
            let signOfPB;
            let signOfQB;
            if (short_names != null && short_names['current_voltage_B'] != null && short_names['current_voltage_B'] != undefined && short_names['current_current_B'] != null && short_names['current_current_B'] != undefined && short_names['current_coef-active-power_B'] != null && short_names['current_coef-active-power_B'] != undefined) {
                signOfPB = Math.sign(short_names['current_voltage_B'].value * short_names['current_current_B'].value * short_names['current_coef-active-power_B'].value)
            }
            if (short_names['current_voltage_B'] != null && short_names['current_voltage_B'] != undefined && short_names['current_coef-active-power_B'] != null && short_names['current_coef-active-power_B'] != undefined && short_names['current_current_B'] != null && short_names['current_current_B'] != undefined) {
                signOfQB = Math.sign(short_names['current_voltage_B'].value * short_names['current_current_B'].value * Math.sqrt(1 - (short_names['current_coef-active-power_B'].value * short_names['current_coef-active-power_B'].value)))
            }
            if (short_names != null && short_names['current_coef-active-power_B'] != undefined && short_names['current_coef-active-power_B'] != null) {
                catB = short_names['current_coef-active-power_B'].value
                if (signOfPB > 0 && signOfQB > 0) {
                    angleB = (Math.acos(catB) * 180 / Math.PI) + 0
                }
                else if (signOfPB < 0 && signOfQB > 0) {
                    angleB = (Math.acos(catB) * 180 / Math.PI) + 0
                }
                else if (signOfPB < 0 && signOfQB < 0) {
                    angleB = Math.abs(360 - (Math.acos(catB) * 180 / Math.PI)) + 0
                }
                else if (signOfPB > 0 && signOfQB < 0) {
                    angleB = Math.abs(360 - (Math.acos(catB) * 180 / Math.PI)) + 0
                }
                if ((short_names != null) && (angleB)) {
                    short_names['current_angle_UI_B'] = { value: angleB.toFixed(2).toString() }
                }
            }
        }
        if (short_names['current_angle_UI_C'] == undefined) {
            let catC = 0;
            let angleC;
            let signOfPC;
            let signOfQC;
            if (short_names != null && short_names['current_voltage_C'] != null && short_names['current_voltage_C'] != undefined && short_names['current_current_C'] != null && short_names['current_current_C'] != undefined && short_names['current_coef-active-power_C'] != null && short_names['current_coef-active-power_C'] != undefined) {
                signOfPC = Math.sign(short_names['current_voltage_C'].value * short_names['current_current_C'].value * short_names['current_coef-active-power_C'].value)
            }
            if (short_names['current_voltage_C'] != null && short_names['current_voltage_C'] != undefined && short_names['current_coef-active-power_C'] != null && short_names['current_coef-active-power_C'] != undefined && short_names['current_current_C'] != null && short_names['current_current_C'] != undefined) {
                signOfQC = Math.sign(short_names['current_voltage_C'].value * short_names['current_current_C'].value * Math.sqrt(1 - (short_names['current_coef-active-power_C'].value * short_names['current_coef-active-power_C'].value)))
            }
            if (short_names != null && short_names['current_coef-active-power_C'] != undefined && short_names['current_coef-active-power_C'] != null) {
                catC = short_names['current_coef-active-power_C'].value
                if (signOfPC > 0 && signOfQC > 0) {
                    angleC = (Math.acos(catC) * 180 / Math.PI) + 0
                }
                else if (signOfPC < 0 && signOfQC > 0) {
                    angleC = (Math.acos(catC) * 180 / Math.PI) + 0
                }
                else if (signOfPC < 0 && signOfQC < 0) {
                    angleC = Math.abs(360 - (Math.acos(catC) * 180 / Math.PI)) + 0
                }
                else if (signOfPC > 0 && signOfQC < 0) {
                    angleC = Math.abs(360 - (Math.acos(catC) * 180 / Math.PI)) + 0
                }
                if ((short_names != null) && (angleC)) {
                    short_names['current_angle_UI_C'] = { value: angleC.toFixed(2).toString() }
                }
            }
        }
        return short_names
    } catch (error) {
        console.log(error)
    }
}



module.exports.formula2 = (short_names) => {
    try {
        if (short_names && (short_names["current_coef-active-power_A"] == undefined || short_names["current_coef-active-power_A"] == "Empty") && ((short_names["current_angle_UI_A"] != undefined))) {
            short_names["current_coef-active-power_A"] = (Math.cos(short_names["current_angle_UI_A"] * Math.PI / 180))
        }
        if (short_names && (short_names["current_coef-active-power_B"] == undefined || short_names["current_reactive-power_B"] == "Empty") && ((short_names["current_angle_UI_B"] != undefined))) {
            short_names["current_coef-active-power_B"] = (Math.cos(short_names["current_angle_UI_B"] * Math.PI / 180))
        }
        if (short_names && (short_names["current_coef-active-power_C"] == undefined || short_names["current_coef-active-power_C"] == "Empty") && ((short_names["current_angle_UI_C"] != undefined))) {
            short_names["current_coef-active-power_C"] = (Math.cos(short_names["current_angle_UI_C"] * Math.PI / 180))
        }
        if (short_names && (short_names["current_coef-active-power_total"] == undefined || short_names["current_coef-active-power_total"] == "Empty") && ((short_names["current_coef-active-power_A"] != undefined) || (short_names["current_coef-active-power_B"] != undefined) || (short_names["current_coef-active-power_C"] != undefined))) {
            short_names = {
                ...short_names,
                ["current_coef-active-power_total"]: (((+short_names["current_coef-active-power_A"] || 0) +
                (+short_names["current_coef-active-power_B"] || 0) +
                (+short_names["current_coef-active-power_C"] || 0)) / 3)
            }
        }
        if (short_names && (short_names["current_sinusf-reactive-power_A"] == undefined || short_names["current_sinusf-reactive-power_A"] == "Empty") && ((short_names["current_angle_UI_A"] != undefined))) {
            short_names["current_sinusf-reactive-power_A"] = (Math.sin(short_names["current_angle_UI_A"] * Math.PI / 180))
        }
        if (short_names && (short_names["current_sinusf-reactive-power_B"] == undefined || short_names["current_sinusf-reactive-power_B"] == "Empty") && ((short_names["current_angle_UI_B"] != undefined))) {
            short_names["current_sinusf-reactive-power_B"] = (Math.sin(short_names["current_angle_UI_B"] * Math.PI / 180))
        }
        if (short_names && (short_names["current_sinusf-reactive-power_C"] == undefined || short_names["current_sinusf-reactive-power_C"] == "Empty") && ((short_names["current_angle_UI_C"] != undefined))) {
            short_names["current_sinusf-reactive-power_C"] = (Math.sin(short_names["current_angle_UI_C"] * Math.PI / 180))
        }
        if (short_names && (short_names["current_sinusf-reactive-power_total"] == undefined || short_names["current_sinusf-reactive-power_total"] == "Empty") && ((short_names["current_sinusf-reactive-power_A"] != undefined) || (short_names["current_sinusf-reactive-power_B"] != undefined) || (short_names["current_sinusf-reactive-power_C"] != undefined))) {
            short_names = {
                ...short_names,
                ["current_sinusf-reactive-power_total"]: (((short_names["current_sinusf-reactive-power_A"] ? short_names["current_sinusf-reactive-power_A"] : 0) +
                    (short_names["current_sinusf-reactive-power_B"] ? short_names["current_sinusf-reactive-power_B"] : 0) +
                    (short_names["current_sinusf-reactive-power_C"] ? short_names["current_sinusf-reactive-power_C"] : 0)) / 3)
            }
        }
        if (short_names && (short_names["current_full-power_A"] == undefined || short_names["current_full-power_A"] == "Empty") && ((short_names["current_voltage_A"] != undefined) && (short_names["current_current_A"] != undefined))) {
            short_names["current_full-power_A"] = ((short_names["current_voltage_A"]) * (short_names["current_current_A"])) / 1000
        }
        if (short_names && (short_names["current_full-power_B"] == undefined || short_names["current_full-power_B"] == "Empty") && ((short_names["current_voltage_B"] != undefined) && (short_names["current_current_B"] != undefined))) {
            short_names["current_full-power_B"] = ((short_names["current_voltage_B"]) * (short_names["current_current_B"])) / 1000
        }
        if (short_names && (short_names["current_full-power_C"] == undefined || short_names["current_full-power_C"] == "Empty") && ((short_names["current_voltage_C"] != undefined) && (short_names["current_current_C"] != undefined))) {
            short_names["current_full-power_C"] = ((short_names["current_voltage_C"]) * (short_names["current_current_C"])) / 1000
        }
        if (short_names && (short_names["current_full-power_total"] == undefined || short_names["current_full-power_total"] == "Empty") && (short_names["current_full-power_A"] != undefined || short_names["current_full-power_B"] != undefined || short_names["current_full-power_C"] != undefined)) {
            short_names = {
                ...short_names,
                ["current_full-power_total"]: ((short_names["current_full-power_A"] || 0) + (short_names["current_full-power_B"] || 0) + (short_names["current_full-power_C"] || 0))
            }
        }
        if (short_names && (short_names["current_active-power_A"] == undefined || short_names["current_active-power_A"] == "Empty") && ((short_names["current_voltage_A"] != undefined) && (short_names["current_current_A"] != undefined) && (short_names["current_coef-active-power_A"] != undefined))) {
            short_names["current_active-power_A"] = ((short_names["current_voltage_A"]) * (short_names["current_current_A"]) * (short_names["current_coef-active-power_A"])) / 1000
        }
        if (short_names && (short_names["current_active-power_B"] == undefined || short_names["current_active-power_B"] == "Empty") && ((short_names["current_voltage_B"] != undefined) && (short_names["current_current_B"] != undefined) && (short_names["current_coef-active-power_B"] != undefined))) {
            short_names["current_active-power_B"] = ((short_names["current_voltage_B"]) * (short_names["current_current_B"]) * (short_names["current_coef-active-power_B"])) / 1000
        }
        if (short_names && (short_names["current_active-power_C"] == undefined || short_names["current_active-power_C"] == "Empty") && ((short_names["current_voltage_C"] != undefined) && (short_names["current_current_C"] != undefined) && (short_names["current_coef-active-power_C"] != undefined))) {
            short_names["current_active-power_C"] = ((short_names["current_voltage_C"]) * (short_names["current_current_C"]) * (short_names["current_coef-active-power_C"])) / 1000
        }
        if (short_names && (short_names["current_active-power_total"] == undefined || short_names["current_active-power_total"] == "Empty") && (short_names["current_active-power_A"] != undefined || short_names["current_active-power_B"] != undefined || short_names["current_active-power_C"] != undefined)) {
            short_names = {
                ...short_names,
                ["current_active-power_total"]:((short_names["current_active-power_A"] ? short_names["current_active-power_A"] : 0) + (short_names["current_active-power_B"] ? short_names["current_active-power_B"] : 0) + (short_names["current_active-power_C"] ? short_names["current_active-power_C"] : 0))
            }
        }
        if (short_names && (short_names["current_reactive-power_A"] == undefined || short_names["current_reactive-power_A"] == "Empty") && ((short_names["current_voltage_A"] != undefined) && (short_names["current_current_A"] != undefined) && (short_names["current_coef-active-power_A"] != undefined))) {
            short_names["current_reactive-power_A"] = ((short_names["current_voltage_A"]) * (short_names["current_current_A"]) * (short_names["current_sinusf-reactive-power_A"])) / 1000
        }
        if (short_names && (short_names["current_reactive-power_B"] == undefined || short_names["current_reactive-power_B"] == "Empty") && ((short_names["current_voltage_B"] != undefined) && (short_names["current_current_B"] != undefined) && (short_names["current_coef-active-power_B"] != undefined))) {
            short_names["current_reactive-power_B"] = ((short_names["current_voltage_B"]) * (short_names["current_current_B"]) * (short_names["current_sinusf-reactive-power_B"])) / 1000
        }
        if (short_names && (short_names["current_reactive-power_C"] == undefined || short_names["current_reactive-power_C"] == "Empty") && ((short_names["current_voltage_C"] != undefined) && (short_names["current_current_C"] != undefined) && (short_names["current_coef-active-power_C"] != undefined))) {
            short_names["current_reactive-power_C"] = ((short_names["current_voltage_C"]) * (short_names["current_current_C"]) * (short_names["current_sinusf-reactive-power_C"])) / 1000
        }
        if (short_names && (short_names["current_reactive-power_total"] == undefined || short_names["current_reactive-power_total"] == "Empty") && (((short_names["current_reactive-power_A"]) != undefined) || ((short_names["current_reactive-power_B"]) != undefined) || ((short_names["current_reactive-power_C"]) != undefined))) {
            short_names = {
                ...short_names,
                ["current_reactive-power_total"]: ((short_names["current_reactive-power_A"] ? short_names["current_reactive-power_A"] : 0) +
                    (short_names["current_reactive-power_B"] ? short_names["current_reactive-power_B"] : 0) +
                    (short_names["current_reactive-power_C"] ? short_names["current_reactive-power_C"] : 0))
            }
        }
        if ((short_names["current_angle_UI_A"] != undefined)) {
            if (short_names && (short_names["current_coef-reactive-power_A"] == undefined || short_names["current_coef-reactive-power_A"] == "Empty")) {
                short_names = {
                    ...short_names,
                    ["current_coef-reactive-power_A"]: (Math.tan(short_names["current_angle_UI_A"] * Math.PI / 180))
                }
            }
        } else {
            if (short_names && (short_names["current_coef-reactive-power_A"] == undefined || short_names["current_coef-reactive-power_A"] == "Empty") && (short_names["current_coef-active-power_A"] != undefined)) {
                if ((short_names["current_coef-active-power_A"]) != 0) {
                    if ((1 / (short_names["current_coef-active-power_A"]) ** 2) >= 1) {
                        short_names = {
                            ...short_names,
                            ["current_coef-reactive-power_A"]: Math.sqrt((1 / ((short_names["current_coef-active-power_A"]) ** 2)) - 1)
                        }
                    }
                }
            }
        }

        if (short_names && (short_names["current_voltage_line_A"] == undefined || short_names["current_voltage_line_A"] == "Empty") && (short_names["current_voltage_A"] != undefined)) {
            short_names["current_voltage_line_A"] = ((short_names["current_voltage_A"]) * Math.sqrt(3))
        }

        if (short_names && (short_names["current_voltage_line_B"] == undefined || short_names["current_voltage_line_B"] == "Empty") && (short_names["current_voltage_B"] != undefined)) {
            short_names["current_voltage_line_B"] = ((short_names["current_voltage_B"]) * Math.sqrt(3))
        }

        if (short_names && (short_names["current_voltage_line_C"] == undefined || short_names["current_voltage_line_C"] == "Empty") && (short_names["current_voltage_C"] != undefined)) {
            short_names["current_voltage_line_C"] = ((short_names["current_voltage_C"]) * Math.sqrt(3))
        }

        if ((short_names["current_angle_UI_B"] != undefined)) {
            if (short_names && (short_names["current_coef-reactive-power_B"] == undefined || short_names["current_reactive-power_B"] == "Empty")) {
                short_names = {
                    ...short_names,
                    ["current_coef-reactive-power_B"]: (Math.tan(short_names["current_angle_UI_B"] * Math.PI / 180))
                }

            }
        } else {
            if (short_names && (short_names["current_coef-reactive-power_B"] == undefined || short_names["current_reactive-power_B"] == "Empty") && (short_names["current_coef-active-power_B"] != undefined)) {
                if ((short_names["current_coef-active-power_B"]) != 0) {
                    if ((1 / (short_names["current_coef-active-power_B"]) ** 2) >= 1) {
                        short_names = {
                            ...short_names,
                            ["current_coef-reactive-power_B"]: Math.sqrt((1 / ((short_names["current_coef-active-power_B"]) ** 2)) - 1)
                        }
                    }
                }
            }
        }

        if ((short_names["current_angle_UI_C"] != undefined)) {
            if (short_names && (short_names["current_coef-reactive-power_C"] == undefined || short_names["current_sinusf-reactive-power_C"] == "Empty")) {
                short_names = {
                    ...short_names,
                    ["current_coef-reactive-power_C"]:(Math.tan(short_names["current_angle_UI_C"] * Math.PI / 180))
                }
            }
        } else {
            if (short_names && (short_names["current_coef-reactive-power_C"] == undefined || short_names["current_sinusf-reactive-power_C"] == "Empty") && (short_names["current_coef-active-power_C"] != undefined)) {
                if ((short_names["current_coef-active-power_C"]) != 0) {
                    if ((1 / (short_names["current_coef-active-power_C"]) ** 2) >= 1) {
                        short_names = {
                            ...short_names,
                            ["current_coef-reactive-power_C"]: Math.sqrt((1 / ((short_names["current_coef-active-power_C"]) ** 2)) - 1)
                        }
                    }
                }
            }
        }
        if (short_names && (short_names["current_coef-reactive-power_total"] == undefined || short_names["current_coef-reactive-power_total"] == "Empty") && (((short_names["current_coef-reactive-power_A"]) != undefined) || ((short_names["current_coef-reactive-power_B"]) != undefined) || ((short_names["current_coef-reactive-power_C"]) != undefined))) {
            short_names = {
                ...short_names,
                ["current_coef-reactive-power_total"]: ((+short_names["current_coef-reactive-power_A"] || 0) + (+short_names["current_coef-reactive-power_B"] || 0) + (+short_names["current_coef-reactive-power_C"] || 0)) / 3
            }
        }
        if (short_names['current_angle_UI_A'] == undefined) {
            let catA = 0;
            let angleA;
            let signOfPA;
            let signOfQA;
            if (short_names != null && short_names['current_voltage_A'] != null && short_names['current_voltage_A'] != undefined && short_names['current_current_A'] != null && short_names['current_current_A'] != undefined && short_names['current_coef-active-power_A'] != null && short_names['current_coef-active-power_A'] != undefined) {
                signOfPA = Math.sign(short_names['current_voltage_A'].value * short_names['current_current_A'].value * short_names['current_coef-active-power_A'].value)
            }
            if (short_names['current_voltage_A'] != null && short_names['current_voltage_A'] != undefined && short_names['current_coef-active-power_A'] != null && short_names['current_coef-active-power_A'] != undefined && short_names['current_current_A'] != null && short_names['current_current_A'] != undefined) {
                signOfQA = Math.sign(short_names['current_voltage_A'].value * short_names['current_current_A'].value * Math.sqrt(1 - (short_names['current_coef-active-power_A'].value * short_names['current_coef-active-power_A'].value)))
            }
            if (short_names != null && short_names['current_coef-active-power_A'] != undefined && short_names['current_coef-active-power_A'] != null) {
                catA = short_names['current_coef-active-power_A'].value
                if (signOfPA > 0 && signOfQA > 0) {
                    angleA = (Math.acos(catA) * 180 / Math.PI) + 0
                }
                else if (signOfPA < 0 && signOfQA > 0) {
                    angleA = (Math.acos(catA) * 180 / Math.PI) + 0
                }
                else if (signOfPA < 0 && signOfQA < 0) {
                    angleA = Math.abs(360 - (Math.acos(catA) * 180 / Math.PI)) + 0
                }
                else if (signOfPA > 0 && signOfQA < 0) {
                    angleA = Math.abs(360 - (Math.acos(catA) * 180 / Math.PI)) + 0
                }
                if ((short_names != null) && (angleA)) {
                    short_names['current_angle_UI_A'] = angleA.toFixed(2).toString()
                }
            }
        }
        if (short_names['current_angle_UI_B'] == undefined) {
            let catB = 0;
            let angleB;
            let signOfPB;
            let signOfQB;
            if (short_names != null && short_names['current_voltage_B'] != null && short_names['current_voltage_B'] != undefined && short_names['current_current_B'] != null && short_names['current_current_B'] != undefined && short_names['current_coef-active-power_B'] != null && short_names['current_coef-active-power_B'] != undefined) {
                signOfPB = Math.sign(short_names['current_voltage_B'].value * short_names['current_current_B'].value * short_names['current_coef-active-power_B'].value)
            }
            if (short_names['current_voltage_B'] != null && short_names['current_voltage_B'] != undefined && short_names['current_coef-active-power_B'] != null && short_names['current_coef-active-power_B'] != undefined && short_names['current_current_B'] != null && short_names['current_current_B'] != undefined) {
                signOfQB = Math.sign(short_names['current_voltage_B'].value * short_names['current_current_B'].value * Math.sqrt(1 - (short_names['current_coef-active-power_B'].value * short_names['current_coef-active-power_B'].value)))
            }
            if (short_names != null && short_names['current_coef-active-power_B'] != undefined && short_names['current_coef-active-power_B'] != null) {
                catB = short_names['current_coef-active-power_B'].value
                if (signOfPB > 0 && signOfQB > 0) {
                    angleB = (Math.acos(catB) * 180 / Math.PI) + 0
                }
                else if (signOfPB < 0 && signOfQB > 0) {
                    angleB = (Math.acos(catB) * 180 / Math.PI) + 0
                }
                else if (signOfPB < 0 && signOfQB < 0) {
                    angleB = Math.abs(360 - (Math.acos(catB) * 180 / Math.PI)) + 0
                }
                else if (signOfPB > 0 && signOfQB < 0) {
                    angleB = Math.abs(360 - (Math.acos(catB) * 180 / Math.PI)) + 0
                }
                if ((short_names != null) && (angleB)) {
                    short_names['current_angle_UI_B'] = angleB.toFixed(2).toString()
                }
            }
        }
        if (short_names['current_angle_UI_C'] == undefined) {
            let catC = 0;
            let angleC;
            let signOfPC;
            let signOfQC;
            if (short_names != null && short_names['current_voltage_C'] != null && short_names['current_voltage_C'] != undefined && short_names['current_current_C'] != null && short_names['current_current_C'] != undefined && short_names['current_coef-active-power_C'] != null && short_names['current_coef-active-power_C'] != undefined) {
                signOfPC = Math.sign(short_names['current_voltage_C'].value * short_names['current_current_C'].value * short_names['current_coef-active-power_C'].value)
            }
            if (short_names['current_voltage_C'] != null && short_names['current_voltage_C'] != undefined && short_names['current_coef-active-power_C'] != null && short_names['current_coef-active-power_C'] != undefined && short_names['current_current_C'] != null && short_names['current_current_C'] != undefined) {
                signOfQC = Math.sign(short_names['current_voltage_C'].value * short_names['current_current_C'].value * Math.sqrt(1 - (short_names['current_coef-active-power_C'].value * short_names['current_coef-active-power_C'].value)))
            }
            if (short_names != null && short_names['current_coef-active-power_C'] != undefined && short_names['current_coef-active-power_C'] != null) {
                catC = short_names['current_coef-active-power_C'].value
                if (signOfPC > 0 && signOfQC > 0) {
                    angleC = (Math.acos(catC) * 180 / Math.PI) + 0
                }
                else if (signOfPC < 0 && signOfQC > 0) {
                    angleC = (Math.acos(catC) * 180 / Math.PI) + 0
                }
                else if (signOfPC < 0 && signOfQC < 0) {
                    angleC = Math.abs(360 - (Math.acos(catC) * 180 / Math.PI)) + 0
                }
                else if (signOfPC > 0 && signOfQC < 0) {
                    angleC = Math.abs(360 - (Math.acos(catC) * 180 / Math.PI)) + 0
                }
                if ((short_names != null) && (angleC)) {
                    short_names['current_angle_UI_C'] = angleC.toFixed(2).toString()
                }
            }
        }
        return short_names
    } catch (error) {
        console.log(error)
    }
}