<template>
  <div class="comp-ke-button" ref="compRef">
    <div class="inner" :style="typeStyle[type]" v-bind="$attrs" ref="innerRef">
      <slot></slot>
    </div>
    <div class="bg" v-if="type === 'blue'" ref="bgRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref, toRefs } from '@vue/runtime-core'
type ButtonType = 'white' | 'blue'

export default defineComponent({
  inheritAttrs: false,
  name: 'KeButton',
  props: {
    /**
     * Button类型： white | blue
     */
    type: {
      type: String as PropType<ButtonType>,
      default: () => 'white',
    },
  },
  setup($props) {
    const data = reactive({
      typeStyle: {
        white: {
          background: 'white',
          color: '#2B85FA',
        },
        blue: {
          background: `linear-gradient(228deg, #36E6FF 0%, #0067EB 100%)`,
          color: 'white',
        },
      },
    })

    let compRef = ref()
    let innerRef = ref()
    let bgRef = ref()
    onMounted(() => {
      let innerStyle = getComputedStyle(innerRef.value)
      compRef.value.style.width = innerStyle.width
      compRef.value.style.height = innerStyle.height

      let borderRadius = parseFloat(innerStyle.height.replace('px', '')) / 2 + 'px'
      compRef.value.style.borderRadius = borderRadius
      innerRef.value.style.borderRadius = borderRadius
      if (bgRef.value) {
        bgRef.value.style.borderRadius = borderRadius
      }
    })
    return { ...toRefs(data), compRef, innerRef, bgRef }
  },
})
</script>

<style lang="scss" scoped>
.comp-ke-button {
  position: relative;

  .inner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 2;
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 32px;
    letter-spacing: 6px;
    width: 320px;
    height: 80px;
  }

  .bg {
    width: 100%;
    height: 100%;
    left: 8px;
    top: 8px;
    position: absolute;
    background: linear-gradient(228deg, rgba(54, 232, 255, 0.5) 0%, rgba(0, 102, 235, 0.5) 100%);
    filter: blur(5px);
    z-index: 1;
  }
}
</style>