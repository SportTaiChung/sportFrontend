<template>
  <div id="ServicePanel" :class="isOpen ? 'open' : ''">
    <div class="overlay" @click="close()"></div>
    <div class="panel">
      <div class="btn-close" @click="close()"></div>

      <div class="body">
        <div class="container">
          <img class="logo" src="@/assets/img/common/service/chat-icon.png" />
          <h5>{{ $t('ServicePanel.UPGService') }}</h5>

          <div class="text-title">
            <p>{{ $t('ServicePanel.Hi') }}</p>
            {{ $t('ServicePanel.ClickQuest') }}
          </div>

          <div class="issues">
            <div
              class="issue-card"
              v-for="(card, index) in cards"
              :key="index"
              @click="$emit('openServiceChat', card.issue)"
            >
              <img class="card-img" :src="require('@/assets/img/common/service/' + card.img)" />
              <div class="card-body">
                <div class="btn"> {{ card.issue }} </div>
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
            id: 0,
            issue: this.$t('ServicePanel.PointQuest'),
            img: 'issue_point.svg',
          },
          {
            id: 1,
            issue: this.$t('ServicePanel.GameQuest'),
            img: 'issue_sport.svg',
          },
          {
            id: 2,
            issue: this.$t('ServicePanel.LotQuest'),
            img: 'issue_lottery.svg',
          },
          {
            id: 3,
            issue: this.$t('ServicePanel.OtherQuest'),
            img: 'issue_other.svg',
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
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      max-width: 400px;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.95);
      background-image: url('~@/assets/img/common/service/panel.jpg');
      background-size: cover;
      box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.4);
      font-size: 1.23rem;
      transform: translateX(-100%);
      transition: 350ms ease;

      @media screen and (max-width: 600px) {
        max-width: 100%;
      }

      .btn-close {
        position: absolute;
        right: 1rem;
        top: 1rem;
        background-image: url('~@/assets/img/common/close.svg');
        background-repeat: no-repeat;
        background-position: center;
        height: 1.4rem;
        width: 1.4rem;
        opacity: 0.5;
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
      }

      .body {
        overflow-y: auto;
        overflow-x: hidden;

        .container {
          padding: 0 0.923rem;
          text-align: center;
          max-width: 300px;
          margin: 5rem auto;
          .logo {
            width: 50%;
            max-width: 100px;
          }

          h5 {
            color: #fff;
            font-size: 20px;
            font-weight: 700;
            text-align: center;
            padding: 10px 0;
            margin: 0;
          }
          .text-title {
            letter-spacing: -0.0089rem;
            color: #fff;
            font-size: 14px;
            margin: 20px 0 50px 0;
            text-align: center;

            p {
              font-size: 18px;
              color: #fff;
              margin-top: 0;
              margin-bottom: 0.5rem;
              line-height: 1.846rem;
            }
          }

          .issues {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            width: 100%;
            .issue-card {
              min-width: 50%;
              max-width: 150px;
              margin: 0.307rem auto;
              cursor: pointer;
              img.card-img {
                max-width: 93px;
                transition: 150ms ease;
                &:hover {
                  filter: brightness(1.2);
                  transform: scale(1.1);
                }
                &:active {
                  filter: brightness(0.9);
                  transform: scale(0.9);
                }
              }
              .card-body {
                text-align: center;
                .btn {
                  color: #fff;
                  font-weight: bold;
                  font-size: 1.23rem;
                  text-align: center;
                  line-height: normal;
                  padding: 6px 12px;
                  margin-bottom: 0.615rem;
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;
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
  }
</style>
