<template>
  <div class="dynamic-scroller-demo">
    <div class="toolbar">
      <input v-model="search" placeholder="Filter..." />
    </div>

    <DynamicScroller :items="filteredItems" :min-item-size="10" class="scroller">
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.message]"
          :data-index="index"
          :data-active="active"
          :title="`Click to change message ${index}`"
          class="message"
          @click.native="changeMessage(item)"
        >
          <div class="avatar">
            <img :key="item.avatar" :src="item.avatar" alt="avatar" class="image" />
          </div>
          <div class="text">
            {{ item.message }}
          </div>
          <div class="index">
            <span>{{ item.id }} (id)</span>
            <span>{{ index }} (index)</span>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script>
  import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
  export default {
    components: {
      DynamicScroller,
      DynamicScrollerItem,
    },
    name: 'TestVirtualList',
    data() {
      const items = [];
      for (let i = 0; i < 100; i++) {
        items.push({
          id: i,
          avatar: 'https://i.pravatar.cc/300',
          message: 'this is message: ' + i,
        });
      }
      return {
        items,
        search: '',
      };
    },
    computed: {
      filteredItems() {
        const { search, items } = this;
        if (!search) return items;
        const lowerCaseSearch = search.toLowerCase();
        return items.filter((i) => i.message.toLowerCase().includes(lowerCaseSearch));
      },
    },
    methods: {
      changeMessage(message) {
        // Object.assign(message, generateMessage());
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dynamic-scroller-demo,
  .scroller {
    height: 800px;
  }
  .dynamic-scroller-demo {
    overflow: hidden;
  }
  .notice {
    padding: 24px;
    font-size: 20px;
    color: #999;
  }
  .message {
    display: flex;
    min-height: 32px;
    padding: 12px;
    box-sizing: border-box;
  }
  .avatar {
    flex: auto 0 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
  }
  .avatar .image {
    max-width: 100%;
    max-height: 100%;
    border-radius: 50%;
  }
  .index,
  .text {
    flex: 1;
  }
  .text {
    max-width: 400px;
  }
  .index {
    opacity: 0.5;
  }
  .index span {
    display: inline-block;
    width: 160px;
    text-align: right;
  }
</style>
