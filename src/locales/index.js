import Vue from 'vue';
import VueI18n from 'vue-i18n';
import lang from '@/utils/lang';
import elementCNLocale from 'element-ui/lib/locale/lang/zh-CN'; // element-ui lang
import elementTWLocale from 'element-ui/lib/locale/lang/zh-TW'; // element-ui lang
import zhTW_Locale from './zh-TW';
import zhCN_Locale from './zh-CN';

Vue.use(VueI18n);

const messages = {
  tw: {
    ...zhTW_Locale,
    ...elementTWLocale,
  },
  cn: {
    ...zhCN_Locale,
    ...elementCNLocale,
  },
};

const i18n = new VueI18n({
  locale: lang,
  messages,
});

export default i18n;
