<script setup>
import Dropdown from "@/components/shared/Dropdown.vue";
import { computed, ref, watch } from "vue";
import { coinsData } from '@/utils/coins.js';
import { useCurrenciesStore } from "@/stores/CurrenciesStore.js";

//data
const sendAmount = ref(null)
const receiveAmount = ref(null)
const exchangeRate = ref()
const fromCurrency = ref()
const toCurrency = ref()
const fromCurrencyLabel = ref()
const coinEqualsError = ref(false)

const store = useCurrenciesStore()

//computed
const calculatedRate = computed(() => (sendAmount.value * rateWithCommission.value))

const calculateAmount = computed(() => (receiveAmount.value / rateWithCommission.value))

const rateWithCommission = computed(() => {
  const rate = exchangeRate.value?.conversion_rate || 0;
  const rateWithCommission = rate - (rate / 100);

  return Number(rateWithCommission.toFixed(8));
});

//methods
const handleInput1Change = () => {
  receiveAmount.value = calculatedRate.value
}

const handleInput2Change = () => {
  sendAmount.value = calculateAmount.value
}

const fromCurrencyCoin = (coin) => {
  fromCurrencyLabel.value = coin.label
  fromCurrency.value = coin.value
}
const toCurrencyCoin = (coin) => {
  toCurrency.value = coin.value
}

// watchers
watch(fromCurrency, (newCoin) => {
  if (toCurrency.value !== newCoin && toCurrency.value) {
    store.getCurrency(fromCurrency.value, toCurrency.value)
    coinEqualsError.value = false
  } else {
    coinEqualsError.value = true
  }
})

watch(toCurrency, (newCoin) => {
  if (fromCurrency.value !== newCoin && fromCurrency.value) {
    store.getCurrency(fromCurrency.value, toCurrency.value)
    coinEqualsError.value = false
  } else {
    coinEqualsError.value = true
  }
})

watch(() => store.currency, (newCurrency) => {
  exchangeRate.value = newCurrency
});

</script>

<template>
  <main>
    <div class="calculator">
      <div class="calculator__item" v-if="fromCurrencyLabel">
        <span class="calculator__title">Amount i have</span>
        <span class="calculator__text-amount">35 000 {{ fromCurrencyLabel}}</span>
      </div>

      <div class="calculator__item">
        <div class="calculator__dropdown">
          <dropdown
              :options="coinsData"
              @get-value="fromCurrencyCoin"
              v-model="fromCurrency"
          />
        </div>
        <div class="calculator__input">
          <input
              type="text"
              placeholder="0"
              v-model.number="sendAmount"
              @input=handleInput1Change
          >
        </div>
        <p></p>
      </div>

      <p class="calculator__title calculator__title--margin">I need</p>
      <div class="calculator__item">
        <div class="calculator__dropdown">
          <dropdown
              :options="coinsData"
              @get-value="toCurrencyCoin"
              v-model="toCurrency"
          />
        </div>

        <div class="calculator__input">
          <input
              type="text"
              placeholder="0"
              v-model.number="receiveAmount"
              @input="handleInput2Change"
          >
        </div>
      </div>

      <p class="calculator__text calculator__text--error" v-if="coinEqualsError">
        Please change the coin
      </p>

      <div class="calculator__item calculator__item--rate">
        <span class="calculator__title">Rate:</span>
        <span class="calculator__title calculator__title--rate">
          {{ rateWithCommission ? rateWithCommission: 0 }}
        </span>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.calculator {
  background: #fff;
  padding: 60px;
  border-top: solid 3px #4785EF;
  width: 520px;

  &__title {
    font-size: 24px;
    font-style: normal;
    font-weight: 400;

    &--margin {
      margin-bottom: 15px;
    }

    &--rate {
      color: #306BCF;
      font-weight: 700;
    }
  }

  &__text {
    font-size: 14px;
    font-weight: 700;

    &--error {
      color: #ff0000;
      margin-bottom: 8px;
    }
  }

  &__text-amount {
    font-size: 18px;
    color: #777;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    margin-bottom: 15px;

    &--rate {
      background: linear-gradient(180deg, #E0F1FF 0%, rgba(224, 241, 255, 0.00) 100%);
      padding: 20px;
    }
  }

  &__dropdown {
    width: 80%;
  }

  &__input {
    margin-left: 10px;
    max-width: 100px;

    input {
      width: 100%;
      text-align: end;
      font-size: 14px;
      font-weight: 700;
      line-height: 145%;
      color: #222;
      border: 1px solid#D9D9D9;
      border-radius: 4px;
      padding: 7px;

      &::placeholder {
        color: inherit;
      }
    }
  }
}
main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>