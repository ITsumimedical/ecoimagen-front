<template>
  <v-card>
    <v-card-title class="claro oscuro--text mb-4">{{ editar ? 'Editar' : 'Crear' }} Familia</v-card-title>
    <form @submit.prevent="submit">
      <v-card-text>
        <p>Campos obligatorios *</p>
        <v-text-field v-model="form.nombre" label="Nombre *" :error-messages="errors.nombre"></v-text-field>
        <v-text-field
          v-model="form.descripcion"
          label="Descripción *"
          :error-messages="errors.descripcion"
        ></v-text-field>
        <v-autocomplete
          v-model="form.tipo_familia_id"
          label="Tipo familia *"
          :items="tipoFamilia"
          item-text="nombre"
          item-value="id"
          :error-messages="errors.tipo_familia_id"
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="$emit('cerrar'), limpiar()">cerrar</v-btn>
        <v-btn color="primary" type="submit">{{ editar ? 'Editar' : 'Crear' }}</v-btn>
      </v-card-actions>
    </form>
    <!-- Preload -->
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-card>
</template>
<script>
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
  name: "FormFamilia",

  props: {
    editar: Boolean,
    familia_id: Number
  },

  watch: {
    familia_id() {
      if (this.editar) {
        this.getFamilia();
      }
    }
  },

  data() {
    return {
      form: {
        nombre: null,
        descripcion: null,
        tipo_familia_id: null
      },
      tipoFamilia: [],
      errors: {
        nombre: null,
        descripcion: null,
        tipo_familia_id: null
      },
      preload: false,
    };
  },

  mounted() {
    this.getTipoFamilia();
    if (this.editar) {
      this.getFamilia();
    }
  },

  methods: {
    async submit() {
      this.limpiarError();
      try {
        const request = {
          nombre: this.form.nombre,
          descripcion: this.form.descripcion,
          tipo_familia_id: this.form.tipo_familia_id
        };
        if (this.editar) {
          await this.$axios.put("/familia/" + this.familia_id, request);
          this.$toast.success("La familia se actualizó correctamente.");
        } else {
          await this.$axios.post("/familia", request);
          this.$toast.success("La familia se creo correctamente.");
        }
        this.limpiar();
        this.$emit("cerrar");
        this.$emit("submit");
      } catch (error) {
        this.ErrorEntrada(error.response.data);
      }
    },

    async getFamilia() {
      try {
        this.preload= true
        const { data } = await this.$axios.get(
          "/familia/consultar/" +
            this.familia_id +
            "?clave=id&relaciones=tipo_familia"
        );
        this.preload = false
        this.form.nombre = data.nombre;
        this.form.descripcion = data.descripcion;
        this.form.tipo_familia_id = parseInt(data.tipo_familia_id);
      } catch (error) {
        console.log(error.response);
      }
    },

    limpiar() {
      this.form.nombre = null;
      this.form.descripcion = null;
      this.form.tipo_familia_id = null;
      this.limpiarError();
    },

    async getTipoFamilia() {
      try {
        const response = await this.$axios.get("/tipo-familia");
        this.tipoFamilia = response.data;
      } catch (error) {
        this.$toast.error("Error al cargar los tipos de familia");
      }
    },

    ErrorEntrada(errors) {
      for (const key in this.errors) {
        if (key in errors) {
          this.errors[key] = errors[key].join(",");
        }
      }
    },

    limpiarError() {
      this.errors.nombre = null;
      this.errors.descripcion = null;
      this.errors.tipo_familia_id = null;
    }
  }
};
</script>
