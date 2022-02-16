<template>
  <div>
    <div v-if="loading">Loading ...</div>

    <!-- List all Cards -->
    <div v-else>
      <q-list>
        <q-item v-for="item in cards" :key="item.id">
          <!-- Last 4 -->
          <q-item-section>
            <div>
              <q-icon name="credit_card"></q-icon>
              <span>**** {{ item.last4 }}</span>
            </div>
          </q-item-section>

          <!-- Standard/Default Bezahlmittel -->
          <q-item-section>
            <div>
              <q-chip
                clickable
                :color="item.default ? 'green-2' : 'grey-4'"
                :text-color="item.default ? 'green' : 'grey-8'"
                class="text-weight-medium"
                @click="
                  editId = item.id;
                  setDefaultDialog = true;
                "
              >
                {{ item.default ? 'Standard' : 'inaktiv' }}
              </q-chip>
            </div>
          </q-item-section>

          <!-- Ablaufdatum -->
          <q-item-section>
            Läuft ab am {{ item.exp_month }}/{{ item.exp_year }}
          </q-item-section>

          <!-- Zahlungsmethode entfernen -->
          <q-item-section>
            <div>
              <q-btn
                icon="delete_outline"
                flat
                :loading="loadingDelete"
                rounded
                @click="deleteCard(item.id)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- Zahlungsmethode hinzufügen -->
      <p @click="editDialog = true" class="cursor-pointer">
        + Zahlungsmethode hinzufügen
      </p>
    </div>

    <!-- Error -->
    <error-banner v-if="!!error" :error="error" />

    <!-- Add Card Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <AddPaymentMethod @close="editDialog = false" @success="appendNewCard" />
    </q-dialog>

    <!-- Set Default Dialog -->
    <q-dialog v-model="setDefaultDialog">
      <SetDefaultCard
        :card_id="editId"
        @close="setDefaultDialog = false"
        @success="updateListDefaultCard"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
// NPM
import { ref } from 'vue';

// LIB
import {
  getCreditCardsAPI,
  deleteCreditCardAPI,
} from 'lib/admin/billing/index';
import { CreditCardAPI } from 'lib/admin/billing/types';

// COMPONENTS
import AddPaymentMethod from './AddPaymentMethod.vue';
import SetDefaultCard from './SetDefaultCard.vue';

const editDialog = ref(false);
const setDefaultDialog = ref(false);

/* Load Cards */
const { data: cards, loading, error } = getCreditCardsAPI();

/**
 * Neu hinzugefügte Karte der Child Komponente der
 * Liste hinzufügen
 */
const appendNewCard = (event: {
  newCard: CreditCardAPI;
  asDefault: boolean;
}) => {
  cards.value.push(event.newCard);

  console.log(event);

  if (event.asDefault == true) {
    updateListDefaultCard(event.newCard.id);
  }
};

/**
 * Payment Method löschen
 */
const loadingDelete = ref(false);

const deleteCard = async (card_id: number) => {
  if (window.confirm('Möchten Sie dieses Zahlunsgmittel wirklich löschen?')) {
    loadingDelete.value = true;
    try {
      await deleteCreditCardAPI(card_id);
      const cardIndex = cards.value.findIndex((c) => c.id == card_id);
      cards.value.splice(cardIndex, 1);
    } catch (e) {
      error.value = e as string;
    }
    loadingDelete.value = false;
  }
};

/**
 * Wenn in der Child componte die Default Card geändert wird,
 * muss dies auch in der Liste hier angepasst werden
 */

const editId = ref(-1);

const updateListDefaultCard = (card_id: number) => {
  // Erst alle auf false setzen
  cards.value = cards.value.map((c) => {
    return {
      ...c,
      default: false,
    };
  });

  // Dann die neue aktiv auf default: true
  const index = cards.value.findIndex((c) => c.id == card_id);
  cards.value[index].default = true;
};
</script>
