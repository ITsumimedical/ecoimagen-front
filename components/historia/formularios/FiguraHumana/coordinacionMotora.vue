<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-account-group-outline"><b>Coordinación motora</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Líneas firmes y bien conectadas (sin tendencias a entrecruzarse, superponerse o a dejar espacios en blanco entre dos extremos).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="coordinacion.lineas" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2. Líneas trazadas firmemente y con unión correcta (más exigente que el anterior).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="coordinacion.trazadas" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>


    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>3. Contorno de la cabeza (más evolucionado que formas rudimentarias, formas primitivas del círculo y la elipse).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="coordinacion.contorno" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>


    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>4. Contorno del tronco (no debe ser
          círculo o elipse).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="coordinacion.tronco" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>


    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>5. Contornos de brazos y piernas (sin
          irregularidades ni estrechamientos).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="coordinacion.brazos_piernas" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>


    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>6. Rasgos faciales regulares,
          coordinados</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="coordinacion.rasgos_faciales" row @change="actualizarDatos">
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
      coordinacion: {
        lineas: '',
        trazadas: '',
        contorno: '',
        tronco: '',
        brazos_piernas: '',
        rasgos_faciales: ''
      },
      row: null,
    };
  },
  computed: {
    total() {
      return Number(this.coordinacion.lineas) + Number(this.coordinacion.trazadas) + Number(this.coordinacion.contorno) + Number(this.coordinacion.tronco) + Number(this.coordinacion.brazos_piernas) + Number(this.coordinacion.rasgos_faciales);
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.total);
    },
  },
};
</script>
