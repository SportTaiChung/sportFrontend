export default {
  props: {
    teamData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    parseScore(key) {
      const str = this.teamData?.[key];
      if (str && str.indexOf(':') !== -1) {
        return str.split(':');
      }
      return ['-', '-'];
    },
    parseDate(str) {
      const d = new Date(str);
      if (d instanceof Date && !isNaN(d)) {
        const date =
          (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
          '-' +
          (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());

        const time =
          (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
          ':' +
          (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        return [date, time];
      }
      return ['-', '-'];
    },
  },
};
