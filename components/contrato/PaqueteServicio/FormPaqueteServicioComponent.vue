<template>
  <v-card>
    <v-card-title class="titulo black--text">
      {{ editar ? "Editar" : "Crear" }} paquete de servicios
    </v-card-title>

    <form @submit.prevent="submit">
      <v-card-text>
        <v-autocomplete
          dense
          :items="cups"
          item-value="id"
          item-text="codigo_nombre"
          v-model="form.cup_id"
          label="Cup asociado *"
          :error-messages="errores.cup_id"
          outlined
        ></v-autocomplete>

        <v-text-field
          label="Codigo Paquete *"
          v-model="form.codigo"
          :error-messages="errores.codigo"
          outlined
          dense
        ></v-text-field>

        <v-text-field
          label="Nombre *"
          v-model="form.nombre"
          :error-messages="errores.nombre"
          outlined
          dense
        ></v-text-field>

        <v-textarea
          label="Descripción *"
          v-model="form.descripcion"
          :error-messages="errores.descripcion"
          auto-grow
          dense
        ></v-textarea>

        <v-text-field
          label="Precio *"
          type="number"
          v-model.number="form.precio"
          :error-messages="errores.precio"
          prefix="$"
          dense
        ></v-text-field>
        <p>Campos obligatorios *</p>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn small @click="$emit('cerrar'), limpiar()" color="error"
          >cancelar</v-btn
        >
        <v-btn
          v-if="editar == false && $can('paqueteServicio.crear')"
          small
          type="submit"
          color="success"
          >Guardar</v-btn
        >

        <v-btn
          v-if="editar == true && $can('paqueteServicio.actualizar')"
          small
          type="submit"
          color="success"
        >
          Editar</v-btn
        >
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
  middleware({ $can, redirect }) {
    if (!$can("contratos.servicios.paquetes")) {
      return redirect("/");
    }
  },

  name: "FormPaqueteServicio",

  props: {
    editar: {
      type: Boolean,
      default: false,
    },
    paquete_servicio_id: {
      type: Number,
      default: null,
    },
  },

  watch: {
    paquete_servicio_id() {
      if (this.editar) {
        this.getPaqueteServicio();
      }
    },
  },

  data() {
    return {
      cups: [],
      preload: false,
      form: {
        nombre: null,
        descripcion: null,
        precio: null,
        codigo: null,
        cup_id: null,
      },
      errores: {
        nombre: null,
        descripcion: null,
        precio: null,
        codigo: null,
        cup_id: null,
      },
    };
  },

  mounted() {
    this.getCups();
    if (this.editar) {
      this.getPaqueteServicio();
    }
  },

  methods: {
    async getCups() {
      try {
        const { data } = await this.$axios.get("/cup");
        this.cups = data.data;
      } catch (error) {
        this.$toast.error("Error al consultar los cups.");
      }
    },

    /** Ejecuta el formulario */
    async submit() {
        this.preload = true;
      try {
        this.limpiarErrores();
        if (this.editar) {
          await this.$axios.put(
            "/paquete-servicio/" + this.paquete_servicio_id,
            this.form
          );
          this.preload = false;
          this.$toast.success("El paquete se actualizo correctamente.");
        } else {
          await this.$axios.post("/paquete-servicio", this.form);
          this.$toast.success(
            "El paquete se creo correctamente, ahora puedes agregarle los respectivos servicios."
          );
        }
        this.preload = false;
        this.$emit("cerrar");
        this.$emit("submit");
        this.limpiar();
      } catch (error) {
        this.preload = false;
        if (error.response.status === 422) {
          this.pintarErrores(error.response.data);
        }
      }
    },

    async getPaqueteServicio() {
      this.preload = true;
      try {
        const { data } = await this.$axios.get(
          "/paquete-servicio/" + this.paquete_servicio_id
        );
        this.preload = false;
        this.form.nombre = data.nombre;
        this.form.descripcion = data.descripcion;
        this.form.precio = data.precio;
        this.form.cup_id = parseInt(data.cup_id);
        this.form.codigo = data.codigo;
      } catch (error) {
        this.preload = false;
      }
    },

    /** Pinta los errores de validación */
    pintarErrores(errores) {
      for (const key in this.errores) {
        if (key in errores) {
          this.errores[key] = errores[key].join(", ");
        }
      }
    },

    limpiar() {
      for (const prop of Object.getOwnPropertyNames(this.form)) {
        this.form[prop] = null;
      }
    },

    limpiarErrores() {
      for (const prop of Object.getOwnPropertyNames(this.errores)) {
        this.errores[prop] = null;
      }
    },
  },
};
</script>
