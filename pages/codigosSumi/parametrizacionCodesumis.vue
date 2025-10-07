<template>
  <v-tabs>
    <v-tab>
      <v-icon left>
        mdi-pill
      </v-icon>
      Vias Administracion
    </v-tab>

    <v-tab>
      <v-icon left>
        mdi-account-multiple-plus-outline
      </v-icon>
      Grupos
    </v-tab>

    <v-tab>
      <v-icon left>
        mdi-medication
      </v-icon>
      Grupos Terapeuticos
    </v-tab>

    <v-tab>
      <v-icon left>
        mdi-medical-bag
      </v-icon>
      Subgrupos terapeuticos
    </v-tab>

    <v-tab>
      <v-icon left>
        mdi-pillar
      </v-icon>
      Lineas Bases
    </v-tab>

    <v-tab>
      <v-icon left>
        mdi-pill-multiple
      </v-icon>
      Principios Activos
    </v-tab>

    <v-tab>
      <v-icon left>
        mdi-needle
      </v-icon>
      Formas farmaceuticas-ffm
    </v-tab>

    <v-tab>
      <v-icon left>
        mdi-ruler
      </v-icon>
      Unidades de medidas
    </v-tab>

    <v-tab>
      <v-icon left>
        mdi-ruler
      </v-icon>
      Unidades de medidas dispensación
    </v-tab>

    <v-tab-item>
      <v-card flat>
        <vias />
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <grupos />
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <gruposTerapeuticos />
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <SubgruposTerapeuticos />
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <lineas />
      </v-card>
    </v-tab-item>

    <v-tab-item>
      <v-card flat>
        <principios />
      </v-card>
    </v-tab-item>

    <v-tab-item>
      <v-card flat>
        <formasFarmaceuticasffm />
      </v-card>
    </v-tab-item>

    <v-tab-item>
      <v-card flat>
        <unidadesMedidas />
      </v-card>
    </v-tab-item>

    <v-tab-item>
      <v-card flat>
        <unidadesMedidasDispensacion />
      </v-card>
    </v-tab-item>


  </v-tabs>
</template>


<script>
import vias from '@/pages/codigosSumi/viasAdministracion.vue';
import grupos from '@/pages/codigosSumi/grupos.vue';
import gruposTerapeuticos from '@/pages/codigosSumi/gruposTerapeuticos.vue';
import SubgruposTerapeuticos from '@/pages/codigosSumi/subgruposTerapeuticos.vue';
import lineas from '@/pages/codigosSumi/lineasBases.vue';
import principios from "@/components/farmacia/productos/principiosActivos.vue";
import formasFarmaceuticasffm from "@/components/farmacia/productos/formasFarmaceuticasffm.vue";
import unidadesMedidas from "@/components/farmacia/productos/unidadesMedidasMedicamentos.vue";
import unidadesMedidasDispensacion from "@/components/farmacia/productos/unidadesMedidasMedicamentosDispensacion.vue"


export default {
  components: {
    vias,
    grupos,
    gruposTerapeuticos,
    SubgruposTerapeuticos,
    lineas,
    principios,
    formasFarmaceuticasffm,
    unidadesMedidas,
    unidadesMedidasDispensacion
  },
  data() {
    return {
    };
  },
  methods: {
  },
};

</script>
