<template>
  <v-card :disabled="loading" :loading="loading">
    <v-card-title class="claro oscuro--text mb-4">
      Crear salario minimo
    </v-card-title>
    <form @submit.prevent="submit">
      <v-card-text>
        <v-autocomplete
          v-model="form.anio"
          :items="listanio"
          label="Año"
          :error-messages="errores.anio"
        ></v-autocomplete>
        <v-text-field
          v-model="form.valor"
          label="Valor"
          type="number"
          :error-messages="errores.valor"
        ></v-text-field>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn @click="$emit('cerrar'), limpiar()" color="error"
          >cancelar</v-btn
        >
        <v-btn type="submit" color="primary">Crear</v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>
<script>
export default {
  middleware({ $can, redirect }) {
    if (!$can("blog.vista")) {
      return redirect("/");
    }
  },

  name: "FormSalarioMinimo",

  mounted() {
    this.arrayAnios();
  },

  data() {
    return {
      form: {
        anio: null,
        valor: null,
      },
      errores: {
        anio: null,
        valor: null,
      },
      loading: false,
      listanio: [],
    };
  },

  methods: {
    arrayAnios() {
      let n = new Date().getFullYear();
      for (let i = n; i >= 2018; i--) {
        this.listanio.push(i);
      }
    },

    async submit() {
      try {
        if (!this.form.anio) return this.$toast.error("Dede agregar un año");
        if (!this.form.valor) return this.$toast.error("Dede agregar un valor");

        this.loading = true;
        const request = {
          anio: this.form.anio,
          valor: this.form.valor,
        };
        await this.$axios.post("/salario-minimo", request);
        this.$toast.success("El salario minimo se creo correctamente.");
        this.limpiar();
        this.$emit("cerrar");
        this.loading = false;
      } catch (error) {
        this.loading = false;
        if (error.response.data) {
          this.ErrorEntrada(error.response.data);
        }
        this.$toast.error("Problemas al crear el cups");
      }
    },

    /** Pinta los errores de validación */
    ErrorEntrada(errores) {
      for (const key in this.errores) {
        if (key in errores) {
          this.errores[key] = errores[key].join(", ");
        }
      }
    },

    limpiar() {
      this.form.anio = null;
      this.form.valor = null;
    },
  },
};
</script>
