<!-- URBVERDE-GCMES/src/components/cards/parks/infoSection/infoParksSection.vue -->
<template>
  <div class="dashboard">
    <div class="left-panel">
      <InfoParks />
    </div>
    <div class="right-wrapper">
      <div class="top">
        <FirstSectionCard
          v-for="(card, index) in firstTwoCards"
          :key="index"
          :data="[formatCardData(card)]"
          class="section-card"
        />
      </div>
      <div class="bottom">
        <FirstSectionCard
          v-for="(card, index) in lastTwoCards"
          :key="index"
          :data="[formatCardData(card)]"
          class="section-card"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InfoParks from './InfoParks.vue';
import FirstSectionCard from '../../FirstSectionCard.vue';

export default {
  components: {
    InfoParks,
    FirstSectionCard
  },

  props: {
    cityCode: {
      type: Number,
      required: true
    },
    selectedYear: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      cardData: []
    };
  },

  computed: {
    firstTwoCards() {
      return this.cardData.slice(0, 2);
    },
    lastTwoCards() {
      return this.cardData.slice(2, 4);
    }
  },

  watch: {
    cityCode: {
      handler: 'fetchData',
      immediate: true
    },
    selectedYear: {
      handler: 'fetchData',
      immediate: true
    }
  },

  methods: {
    formatCardData(card) {
      // Cria uma cópia do cartão para não modificar o original
      const formattedCard = { ...card };

      // Verifica se é o cartão de desigualdade de renda
      if (formattedCard.title === 'Desigualdade de renda') {
        // Extrai o valor numérico (removendo o 'x' do final)
        const valueNum = parseFloat(formattedCard.value.replace('x', ''));

        // Calcula a porcentagem
        const percentageDiff = Math.abs(Math.round((valueNum * 100) - 100));

        // Determina se é "mais renda" ou "menos renda" com base no valor
        const incomeText = valueNum >= 1
          ? `Moradores próximos a praças têm em média ${percentageDiff}% mais de renda`
          : `Moradores próximos a praças têm em média ${percentageDiff}% menos de renda`;

        // Atualiza o subtítulo
        formattedCard.subtitle = incomeText;
      }

      return formattedCard;
    },

    async fetchData() {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/square/parks?city=${this.cityCode}&year=${this.selectedYear}`);
        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Error fetching cards data:', error);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.dashboard {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  width: 100%;
  flex-wrap: wrap;
}

.left-panel {
  flex: 0 1 40%;
  min-width: 240px;
}

.right-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
}

.top,
.bottom {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  flex-wrap: wrap;
}

.section-card {
  flex: 1;
  border-radius: 16px;
  padding: 24px;
}

@include breakpoint-down('tablet') {
  .right-wrapper {
    gap: 16px;
  }

  .top,
  .bottom {
    gap: 16px;
  }
}

@media (max-width: 700px) {
  .left-panel,
  .right-wrapper {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
