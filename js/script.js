"use strict"

// вызов функций
document.addEventListener("DOMContentLoaded", () => {
    noScrollDocumentWithOpenedBurger()
    runningLine()
    phoneMask()
    processingForm()
})

const body = document.body

// ГЛОБАЛЬНЫЕ КЛАССЫ
const noScrollClass = "no-scroll"

// массив элементов закрытия формы
const closeFormElements = [document.querySelector(".popup__close"), popup.querySelector(".popup__overlay")]

// ф-ция операций с классами (add, remove, toggle)
const moveClass = (action, className, ...elems) => {
    elems.forEach(elem => elem.classList[action](className))
}

// ф-ция убивания скролла при открытом бургер-меню
function noScrollDocumentWithOpenedBurger() {
    const deleteScroll = () => {
        const fixBlocks = document.querySelectorAll(`.fix`)
        const paddingOffset = window.innerWidth - body.offsetWidth + "px"
        const updatePaddingRight = el => {
            el.style.paddingRight = paddingOffset
        }
        moveClass("toggle", noScrollClass, body)
        if (fixBlocks.length > 0) fixBlocks.forEach(fixBlock => updatePaddingRight(fixBlock))
        fixBlocks.forEach(fixBlock => updatePaddingRight(fixBlock))
        updatePaddingRight(body)
    }
    const toggleScroll = (...btns) => {
        btns.forEach(btn => btn.addEventListener("click", deleteScroll))
    }
    toggleScroll(document.querySelector(".burger-btn"), document.querySelector(".btn-offer"), ...closeFormElements)
}

// ф-ция движения ленточек
function runningLine() {
    const contentClass = "running-line__text"
    const runningBodys = document.querySelectorAll(".running-line__body")

    if (runningBodys.length > 0) {
        runningBodys.forEach(runningBody => {
            const runningText = runningBody.querySelector(`.${contentClass}`)
            const runningTextContent = runningText.innerHTML

            function createInfiniteRunningText() {
                const clonedTextContent = document.createElement("div")
                clonedTextContent.className = contentClass
                clonedTextContent.innerHTML = runningTextContent
                runningBody.appendChild(clonedTextContent)
            }

            // задаем количество повторяющихся элементов
            for (let i = 0; i < 5; i++) {
                createInfiniteRunningText()
            }
        })
    }
}

// маска телефонов
function phoneMask() {
    const phoneInputs = document.querySelectorAll("input[data-tel-mask]")

    const getPhoneNumbersValue = input => input.value.replace(/\D/g, "")

    const phoneMask = e => {
        const ruCodes = ["7", "8", "9"]
        const input = e.target
        let inputNumbersValue = getPhoneNumbersValue(input)
        let formattedValue = ""
        let startCursor = input.selectionStart
        const countryCode = inputNumbersValue[0]

        if (!inputNumbersValue) input.value = ""

        if (input.value.length != startCursor) {
            if (e.data && /\D/g.test(e.data)) input.value = inputNumbersValue
            return
        }

        if (ruCodes.indexOf(countryCode) > -1) {
            // russian phone
            if (countryCode == "9") inputNumbersValue = `7${inputNumbersValue}`
            let firstSymbols = countryCode == "8" ? "8" : "+7"
            formattedValue = `${firstSymbols} `
            if (inputNumbersValue.length > 1) formattedValue += `(${inputNumbersValue.substring(1, 4)}`
            if (inputNumbersValue.length >= 5) formattedValue += `) ${inputNumbersValue.substring(4, 7)}`
            if (inputNumbersValue.length >= 8) formattedValue += `-${inputNumbersValue.substring(7, 9)}`
            if (inputNumbersValue.length >= 10) formattedValue += `-${inputNumbersValue.substring(9, 11)}`
        } else {
            // NOT russian phone
            formattedValue = `+${inputNumbersValue}`
        }
        input.value = formattedValue
    }

    const phoneKeyDown = e => {
        const input = e.target
        if (e.keyCode == 8 && getPhoneNumbersValue(input).length == 1) input.value = ""
    }

    phoneInputs.forEach(phoneInput => {
        phoneInput.addEventListener("input", phoneMask)
        phoneInput.addEventListener("keydown", phoneKeyDown)
    })
}

/// ф-ция полной обработки формы
function processingForm() {
    const showClass = "show"
    const errorTextClass = "errorText"
    const popup = document.getElementById("popup")
    const showFormBtn = document.getElementById("showForm-btn")
    const form = document.getElementById("form")
    const AllInputs = form.querySelectorAll("input")
    const AllRequiredInputs = [...AllInputs].filter(input => input.dataset.required)
    const inputsText = [...AllRequiredInputs].filter(input => input.type === "text")

    // вводим только буквы
    const onlyLettersValue = e => !isNaN(e.key) && e.preventDefault()
    inputsText.forEach(inputText => inputText.addEventListener("keydown", onlyLettersValue))

    // показ формы
    const showForm = () => moveClass("add", showClass, popup)

    // скрытие формы
    const closeForm = () => moveClass("remove", showClass, popup)

    // показ ошибок
    function showError(inputElement, message) {
        const errorElement = document.createElement("span")
        errorElement.className = errorTextClass
        errorElement.textContent = message
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling)
    }

    // сброс ошибок
    function clearErrors() {
        const errorElements = form.querySelectorAll(`.${errorTextClass}`)
        if (errorElements.length > 0) {
            errorElements.forEach(errorElement => errorElement.remove())
        }
    }

    showFormBtn.addEventListener("click", showForm)
    closeFormElements.forEach(closeFormElem => closeFormElem.addEventListener("click", closeForm))

    // валидация
    const validateForm = e => {
        const emptyFieldText = "Поле не заполнено"
        const inputsPhone = [...AllRequiredInputs].filter(input => input.type === "tel")
        const inputsCheckboxes = [...AllRequiredInputs].filter(input => input.type === "checkbox")

        // e && e.preventDefault() // отменяем стандартное поведение
        clearErrors()

        return new Promise((resolve, reject) => {
            let isValid = true

            if (AllRequiredInputs) {
                // валидация текстовых инпутов
                if (inputsText.length > 0) {
                    inputsText.forEach(inputText => {
                        if (inputText.value.trim() === "") {
                            showError(inputText, emptyFieldText)
                            isValid = false
                        }
                    })
                }

                // Валидация телефона
                if (inputsPhone.length > 0) {
                    inputsPhone.forEach(inputPhone => {
                        const maxLength = parseInt(inputPhone.getAttribute("maxlength"))
                        const eightIsFirst = inputPhone.value.startsWith("8")

                        // Учитываем, что для номера, начинающегося с 8, максимальная длина должна быть на 1 меньше
                        const adjustedMaxLength = eightIsFirst ? maxLength - 1 : maxLength

                        if (inputPhone.value.length === 0) {
                            showError(inputPhone, emptyFieldText)
                            isValid = false
                        }

                        if (inputPhone.value.length > 0 && inputPhone.value.length < adjustedMaxLength) {
                            showError(inputPhone, `Введите 11 цифр`)
                            isValid = false
                        }
                    })
                }

                if (inputsCheckboxes.length > 0) {
                    const notCheckedClass = "notChecked"

                    inputsCheckboxes.forEach(inputCheckbox => {
                        if (!inputCheckbox.checked) {
                            moveClass("add", notCheckedClass, inputCheckbox)
                            isValid = false
                        }
                        inputCheckbox.addEventListener("change", () => {
                            if (inputCheckbox.checked) {
                                moveClass("remove", notCheckedClass, inputCheckbox)
                            }
                        })
                    })
                }
            }

            isValid ? resolve() : reject()
        })
    }

    form.addEventListener("submit", e => {
        const dialog = popup.querySelector("dialog")

        validateForm(e)
        .then(() => {
            closeForm()
            dialog.showModal()
            setTimeout(() => {
                dialog.close()
                moveClass("toggle", noScrollClass, body)
                body.style.paddingRight = 0
            }, 2500)
        })
        .catch(() => console.log("Форма содержит ошибки"))
    })
}
