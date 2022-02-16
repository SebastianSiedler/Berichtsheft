import formComponents from './Forms/z_formComponents';
import ErrorBanner from '../ErrorBanner.vue';
import VChip from './VChip.vue';

export const baseComponents = {
  ...formComponents,
  'error-banner': ErrorBanner,
  'v-chip': VChip,
};
