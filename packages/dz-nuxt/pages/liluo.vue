<template>
  <div class="input-words">
    <input type="text" v-model="input" placeholder="请以英文逗号分隔，如:1,2,3">
    <input class="rat" type="text" v-model="rate1" placeholder="计算平均值比率">
    <input class="rat" type="text" v-model="rate2" placeholder="计算偏差比率">
    <input class="rat" type="text" v-model="score" placeholder="总分">
    <!-- <input class="rat" type="text" v-model="rate4" placeholder="低1%扣分比率"> -->
    <button @click="caculate">GO</button>
    <p>基准价：{{aver}}</p>
    <div v-for="(i,index) in result.input">
      <span>输入：{{i}}</span>
      <span>得分: {{result.output[index]}}</span>
    </div>
  </div>
</template>

<script>
export default{
  data() {
    return {
      input: '',
      result: {
        input: [],
        output: []
      },
      total: 0,
      aver: 0,
      over: 0,
      score: 30,
      rate1: 0.2,
      rate2: 1.0,
    }
  },
  methods: {
    caculate() {
      let that = this
      this.result = {
        input: [],
        output: []
      }
      let ss = this.input.trim().split(',')
      ss.forEach(function(item){
        that.result.input.push(Number(item))
      })
      if(that.averg(that.result.input)){

      }
    },
    finalsc() {
      let that = this
      let dec = 0
      that.aver = that.aver * Number(that.rate2)
      that.result.input.forEach(function(item){
        if(item > that.aver){
          let sss = ((item-that.aver)/that.aver)*100*1
          that.result.output.push(that.score-sss)
        }
        else{
          let sss = ((that.aver-item)/that.aver)*100*0.5
          that.result.output.push(that.score-sss)
        }
      })
    },
    averg(arr) {
      let that = this
      that.total = 0
      that.over = 0
      arr.forEach(function(item){
        that.total += item
      })
      that.aver = that.total/arr.length
      console.log(that.total, that.aver)

      arr.forEach(function(item,index){
        console.log(1+Number(that.rate1))
        if(item>that.aver*(1+Number(that.rate1)) || item<that.aver*(1-Number(that.rate1))){
          arr.splice(index, 1)
          console.log(arr)
          that.over ++
        }
      })
      if(that.over){
        that.averg(arr)
      }
      else{
        that.finalsc()
        return true
      }
    }
  }
}
</script>

<style lang="less">
  .input-words {
    text-align: center;
    input{
      width: 80%;
      height: 2em;
      margin: 1% 10%;
      &.rat{
        width: 40%;
      }
    }
    button{
      width: 20%;
      height: 2em;
      border: none;
      margin: 1% 40%;
    }
    p{
      color: #fff;
      margin: 0 40%;
      width: 20%;
    }
    span{
      min-width: 8em;
      height: 2em;
      display: inline-block;
      line-height: 2em;
      color: #fff;
      margin: 0 1em;
    }
  }

</style>
