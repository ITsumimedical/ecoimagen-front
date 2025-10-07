<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-tshirt-crew"><b>Proporciones</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Cabeza es 10-50% del tronco.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="proporciones.cabeza" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2.Brazos aproximadamente igual de largos al tronco (no debe llegar a rodillas).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="proporciones.brazos" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>3. Piernas son 1-2 veces la longitud del tronco y son menos anchas que el tronco.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="proporciones.piernas" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>4. Pies no deben tener aspecto de palos de golf y su longitud no excede la longitud de la
          pierna.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="proporciones.pies" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>5. Brazos y piernas en dos dimensiones.
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="proporciones.pies_dimensiones" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>5. Presencia de tacones.
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="proporciones.tacones" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        proporciones: {
          cabeza: '',
          brazos: '',
          piernas: '',
          pies: '',
          pies_dimensiones: '',
          tacones: ''
        },
        row: null,
      };
    },
    computed: {
      total() {
        return Number(this.proporciones.cabeza) + Number(this.proporciones.brazos) + Number(this.proporciones.piernas) +
          Number(this.proporciones.pies) + Number(this.proporciones.pies_dimensiones) + Number(this.proporciones
            .tacones);
      },
    },
    methods: {
      actualizarDatos() {
        this.$emit("update-data", this.total);
      },
    },
  };

</script>
