<script setup>
import { computed, defineProps, ref, defineEmits, onMounted, onBeforeUnmount } from 'vue'
import Svg from "@/components/shared/Svg.vue";

// props
const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    default: null
  }
})

// data
const dropdown = ref(null)
const emit = defineEmits(['getValue'])
const selectedOption = ref(null)
const isDropdownVisible = ref(false)

//computed
const mappedSelectedOption = computed(() => {
  return (selectedOption.value?.label || selectedOption.label) ||
      'Choose'
})

// methods
const toggleOptionSelect = (option) => {
  selectedOption.value = option
  emit('getValue', option)
  isDropdownVisible.value = false
}
const closeDropdown = (element) => {
  if (!dropdown.value.contains(element.target)) {
    isDropdownVisible.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', closeDropdown)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdown)
})

</script>

<template>
  <div class="dropdown-wrapper" ref="dropdown">
    <div
        @click="isDropdownVisible = true"
        class="dropdown-selected-option"
        :style="{
          'font-weight': mappedSelectedOption !== 'Choose' ? '700': ''
        }
    ">
      <Svg
          class="icon"
          :name="`${selectedOption.value}`"
          :key="selectedOption.id"
          v-if="mappedSelectedOption !== 'Choose'
      "/>
      {{ mappedSelectedOption }}
      <Svg
          name="arrow"
          class="arrow-icon"
      />

    </div>

    <transition name="slide-fade">
      <ul
          class="options-wrapper"
          v-if="isDropdownVisible"
      >
        <li
            class="option"
            v-for="option in props.options"
            @click="toggleOptionSelect(option)"
        >
          <Svg :name="`${option.value}`" class="icon "/>
          {{ option.label || option }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<style lang="scss">
.dropdown-wrapper {
  cursor: pointer;
  position: relative;
}

.options-wrapper {
  max-width: 200px;
  margin: 0 auto;
  position: absolute;
  background: ghostwhite;
  z-index: 1;
}

.dropdown-selected-option {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: solid 1px #D9D9D9;
  box-sizing: border-box;

  svg {
    margin-right: 5px;
  }
}

.arrow-icon {
  margin-left: 6px;
}

.option {
  padding: 16px;
  border: solid 1px #313131;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  svg {
    margin-right: 5px;
  }

  &:hover {
    background: #c5c5c5;
  }

  &:last-of-type {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>