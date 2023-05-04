<template lang="pug">
.explorer
  .search
    input(placeholder="tx hash" v-model="txInput" @keyup.enter="updateTransaction")
    .enter(@click="updateTransaction") SEARCH
  .info(v-if="tx")
    .field
      .key from
      .value.from {{ tx.from }}
    .field
      .key hash
      .value.hash {{ tx.hash }}
    .field
      .key height
      .value.height {{ tx.height }}
    .field
      .key fee
      .value.fee {{ tx.fee }}
  .cards
    .card(v-for="{ to, amount } in tx.tx" :key="to")
      .field
        .key to
        .value.to {{ to }}
      .field
        .key amount
        .value.amount {{ amount }}
</template>

<script setup>
import { ref, computed } from 'vue';
import { get_transaction } from '../sui.js';
import { useToast } from 'vue-toastification';

const txInput = ref('');
const tx = ref('');
const toast = useToast();

const updateTransaction = async () => {
  try {
    tx.value = await get_transaction(txInput.value);
    console.log(tx.value);
  } catch (error) {
    toast.error(error.message);
  }
};
</script>

<style lang="stylus" scoped>
$bgColor = #f0f3f7
$shadowColorLight = #ffffff
$shadowColorDark = #cfd4da

.to
  color #2980B9
.amount
  color #E67E22
.from
  color #27AE60
.hash
  color #7F8C8D
  text-transform uppercase
  font-size .8em
.fee
  color #F39C12
  font-size .85em
.height
  color #8E44AD
  font-size .8em


.field
  display flex
  flex-flow row nowrap
  align-items baseline
  .key
    text-transform uppercase
    font-size .7em
    font-weight 900
    opacity .7
    margin-right 1em
    text-align right
    width 100px


.explorer
  padding 0 1em
  padding-top 1em
  display grid
  grid "search" 70px "info" 100px "cards" 1fr / 1fr
  place-items start center
  width 100vw
  height 100vh

  .cards
    display flex
    flex-flow column nowrap
    overflow-y auto
    .card
      display flex
      flex-flow column nowrap
      margin 1em
      padding 1em
      border-radius 10px
      box-shadow 4px 4px 6px $shadowColorDark, -4px -4px 6px $shadowColorLight
  .search
    display flex
    flex-flow row nowrap
    align-items center
    position relative
    background $bgColor
    border-radius 10px
    box-shadow inset 4px 4px 6px $shadowColorDark, inset -4px -4px 6px $shadowColorLight
    width 500px
    padding .25em .5em
    input
      padding 0.5em
      border none
      outline none
      background none
      width 100%
      font-size 0.9em
      color #4d4d4d
      padding-right 80px
    .enter
      position absolute
      right 10px
      background none
      border none
      font-size 0.9em
      font-weight bold
      color #4d4d4d
      text-transform uppercase
      cursor pointer
      outline none
      z-index 1
      user-select none
  span
    color #212121
    display block
    margin-top 1em
</style>
