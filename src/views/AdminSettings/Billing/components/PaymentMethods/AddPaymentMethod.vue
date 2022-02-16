<template>
  <q-card style="width: 400px">
    <q-card-section class="row">
      <div class="col-2">
        <q-btn @click="$emit('close')" icon="close" flat />
      </div>
      <div class="col-8 text-h5 text-center">Kreditkarte hinzufügen</div>
    </q-card-section>
    <q-card-section>
      <form @submit.prevent="handleSubmit">
        <!-- Loading -->
        <div v-if="loadingStripe">Loading ...</div>

        <!-- Stripe input Credit Card -->
        <div class="inputCardStyle">
          <span id="cardForm" />
        </div>

        <!-- Error  -->
        <div v-if="!!errorMessage">{{ errorMessage }}</div>

        <!-- Send Button -->
        <div class="row justify-end q-mt-md" v-if="!loadingStripe">
          <q-checkbox v-model="setAsDefault">
            Als neue Standarmethode
          </q-checkbox>
          <q-btn type="submit" :loading="loadingSend">Hinzufügen</q-btn>
        </div>
      </form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
// NPM
import { onMounted, ref } from 'vue';
import { Stripe, StripeCardElement } from '@stripe/stripe-js';

// LIB
import { addCreditCardAPI, setDefaultCardAPI } from 'lib/admin/billing/index';

// STRIPE CARD INIT
import { cardStyle } from './cardStyle';
import { initStripeJS } from './billing';

// emit
const emit = defineEmits(['close', 'success']);

const errorMessage = ref('');
const loadingSend = ref(false);
const loadingStripe = ref(true);

let stripe: Stripe | null;
let card: StripeCardElement;

const setAsDefault = ref(false);

/**
 * Wenn das AddPaymentMethod Fenster geöffnet wird,
 * wird das Stripe Input Card Feld an das passende
 * HTML Element gemountet
 */
onMounted(async () => {
  try {
    stripe = await initStripeJS();

    const elements = stripe.elements();
    card = elements.create('card', cardStyle());
    card.mount('#cardForm');
  } catch (e) {
    errorMessage.value = e as string;
  }
  loadingStripe.value = false;
});

/**
 * Speichert die Karte
 */
const handleSubmit = async () => {
  loadingSend.value = true;
  errorMessage.value = '';
  if (!!stripe) {
    const { token, error } = await stripe.createToken({ ...card });

    // Wenn ein Fehler beim Validieren/Senden auftritt
    if (error?.message) {
      errorMessage.value = error.message;
    }
    // Kein Fehler
    else {
      // Token in Backend posten
      try {
        if (!!token) {
          try {
            const newCard = await addCreditCardAPI(token?.id);

            if (setAsDefault.value == true) {
              await setDefaultCardAPI(newCard.id);
            }

            emit('success', { newCard, asDefault: setAsDefault.value });
            emit('close');
          } catch (e) {
            errorMessage.value = e as string;
          }
        }
      } catch (e) {
        errorMessage.value = e as string;
      }
      emit('close');
    }
  } else {
    errorMessage.value = 'Fehlerhafte Kommunikation zum Finanzdienstleister';
  }
  loadingSend.value = false;
};
</script>

<style>
.inputCardStyle {
  border-bottom: 1px solid var(--q-primary);
  padding: 5px;
}
</style>
