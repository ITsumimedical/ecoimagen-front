<template>
  <div>
    <v-card>
      <v-alert dense text border="left" type="info" icon="mdi-bell-cog">Módulo de parametrización de los tipos de test
      </v-alert>
      <v-tabs next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows grow>
        <v-tab>
          Tipo Test
        </v-tab>
        <v-tab>
          Preguntas para el tipo de test
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <tipoTest></tipoTest>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <preguntasTest></preguntasTest>
            </v-card-text>
          </v-card>
        </v-tab-item>

      </v-tabs>
    </v-card>
  </div>
</template>

<script>
  import tipoTest from "../../components/TipoTest/tipoTest.vue";
  import preguntasTest from "../../components/TipoTest/preguntasTipoTest.vue";

  export default {

    components: {
      tipoTest,
      preguntasTest
    },

  };

</script>
