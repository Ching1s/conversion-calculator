import { defineStore } from 'pinia'
import axios from "axios";

export const useCurrenciesStore = defineStore('CurrenciesStore', {
    state: () => ({
        currency: null
    }),
    getters: {},
    actions: {
        async getCurrency(currency_from, currency_to) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/calculator/exchange/calculate`, {
                    currency_from,
                    currency_to
                })
                this.currency = res.data.data

            } catch (error) {
                throw new Error(error.response.data.message)
            }
        },
    },
})
