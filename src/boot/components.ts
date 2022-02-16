import { boot } from 'quasar/wrappers';
import { baseComponents } from 'src/components/base/baseComponents';

export default boot(({ app }) => {
  /**
   * Register each Component with:
   * key: ComponentName (e.g. v-combobox)
   * value: Component itself
   */
  for (const [key, value] of Object.entries(baseComponents)) {
    app.component(key, value);
  }
});
