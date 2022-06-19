<template>
  <div id="ServicePanel" :class="isOpen ? 'open' : ''">
    <div class="overlay" @click="close()"></div>
    <div class="panel">
      <div class="header">
        <h5>專屬客服</h5>
        <div class="btn-close" @click="close()"></div>
      </div>

      <div class="body">
        <div class="container">
          <p>您好，歡迎來到新體育，請先點擊以下問題分類，讓我能夠更快的為您服務</p>

          <div class="issues">
            <div class="issue-card" v-for="(card, index) in cards" :key="index">
              <img class="card-img" :src="require('@/assets/img/common/service/' + card.img)" />
              <div class="card-body">
                <div class="btn" @click="$emit('openServiceChat', 0)"> {{ card.issue }} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ServicePanel',
    props: {
      isOpen: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        cards: [
          {
            issue: '點數問題',
            img: 'issue_point.png',
          },
          {
            issue: '球賽問題',
            img: 'issue_sport.png',
          },
          {
            issue: '彩球遊戲',
            img: 'issue_lottery.png',
          },
          {
            issue: '其他問題',
            img: 'issue_other.png',
          },
        ],
      };
    },
    methods: {
      close() {
        this.$emit('closeMe');
      },
    },
  };
</script>

<style lang="scss" scoped>
  #ServicePanel {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
    overflow: hidden;

    &.open {
      pointer-events: auto;
      .overlay {
        opacity: 1;
      }
      .panel {
        transform: translateX(0);
      }
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      opacity: 0;
      transition: 350ms ease;
    }

    .panel {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      max-width: 400px;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.95);
      box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.4);
      font-size: 1.23rem;
      transform: translateX(-100%);
      transition: 350ms ease;

      .header {
        flex: 0 1;
        padding: 1.23rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        h5 {
          color: #38a688;
          font-size: 1.538rem;
          margin: 0;
          font-size: 1.538rem;
          font-weight: 500;
          line-height: 1.5;
        }
        .btn-close {
          background-image: url('~@/assets/img/common/close.svg');
          background-repeat: no-repeat;
          background-position: center;
          height: 1.23rem;
          width: 1.23rem;
          margin-left: auto;
          opacity: 0.5;
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        }
      }

      .body {
        flex: 1;
        padding: 1.23rem;
        overflow: auto;
        .container {
          padding: 0 0.923rem;
        }
        p {
          margin-top: 0;
          margin-bottom: 1.23rem;
          line-height: 1.846rem;
        }

        .issues {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          margin: 0 -0.923rem;
          .issue-card {
            min-width: 50%;
            max-width: 150px;
            margin: 0.307rem auto;
            background-color: #fff;
            border: 1px solid rgba(0, 0, 0, 0.125);
            border-radius: 50rem;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.075);
            img.card-img {
              width: 100%;
              border-radius: 50rem;
              box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
            }
            .card-body {
              padding: 1.23rem;
              text-align: center;
              .btn {
                color: #fff;
                font-weight: bold;
                font-size: 1.23rem;
                text-align: center;
                line-height: normal;
                padding: 6px 12px;
                background-color: #38a688;
                margin-bottom: 0.615rem;
                border-radius: 50rem;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                min-height: 2.923rem;
                cursor: pointer;
                &:hover {
                  filter: brightness(1.1);
                }
              }
            }
          }
        }
      }
    }
  }
</style>
