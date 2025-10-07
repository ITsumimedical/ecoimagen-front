<template>
  <v-card>
    <v-card-title>
      {{ editar ? "Editar" : "Crear" }} Tarifas
    </v-card-title>
  
    <v-form ref="form" @submit.prevent="submit">
      <v-card-text>
  
        <v-autocomplete :items="reps" item-text="nombre" item-value="id" label="Sedes" v-model="form.rep_id"
          v-if="this.editar == false" outlined dense :error-messages="errores.rep_id"></v-autocomplete>
  
        <v-autocomplete v-model="form.manual_tarifario_id" :items="manuales_tarifarios" item-text="nombre" item-value="id"
          label="Manual Tarifario *" outlined dense :error-messages="errores.manual_tarifario_id">
        </v-autocomplete>

        <v-text-field v-model="form.etiqueta" label="Etiqueta *" outlined dense :error-messages="errores.etiqueta">
        </v-text-field>
  
        <v-text-field
          v-if="form.manual_tarifario_id >= 4 && form.manual_tarifario_id != 6 && form.manual_tarifario_id != 7"
          v-model="form.valor" type="number" label="Valor capitado *" outlined dense :error-messages="errores.valor">
        </v-text-field>
  
        <v-text-field
          v-if="form.manual_tarifario_id >= 4 && form.manual_tarifario_id != 6 && form.manual_tarifario_id != 7"
          v-model="form.cantiad_personas" type="number" label="Cantidad de personas *" outlined dense :error-messages="errores.cantiad_personas">
        </v-text-field>
  
        <v-checkbox
          v-if="(form.manual_tarifario_id < 4 || form.manual_tarifario_id == 7 ) && form.manual_tarifario_id != 6"
          v-model="form.pleno" label="Pleno">
        </v-checkbox>
  
        <v-text-field
          v-if="form.pleno == false && (form.manual_tarifario_id < 4 || form.manual_tarifario_id == 7 ) && form.manual_tarifario_id != 6"
          v-model="form.valor" label="Porcentaje *" outlined dense :error-messages="errores.valor"></v-text-field>
      </v-card-text>
  
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="$emit('cerrar'), limpiar()">cerrar</v-btn>
        <v-btn color="boton" dark type="submit">
          {{editar ? "Editar" : "Crear"}}
        </v-btn>
      </v-card-actions>
  
    </v-form>
  </v-card>
</template>
<script>
import {
  mapActions
} from 'vuex';
export default {

  name: "FormTarifa",

  props: {
    editar: {
      type: Boolean,
      default: false,
    },
    prestador_id: {
      type: Number,
      default: null,
    },
    tarifa_id: {
      type: Number,
      default: null,
    },
    contrato_id: {
      type: Number,
      default: null,
    }
  },

  data() {
    return {
      form: {
        rep_id: null,
        manual_tarifario_id: null,
        pleno: false,
        valor: 0,
        cantiad_personas: 0,
        etiqueta: '',
      },
      errores: {
        rep_id: '',
        manual_tarifario_id: '',
        pleno: '',
        valor: '',
        cantiad_personas: '',
        etiqueta: '',
      },
      manuales_tarifarios: [],
      preload: false,
      reps: [],
    };
  },

  watch: {

    'form.manual_tarifario_id'() {
      this.form.pleno = false;
      this.form.valor = 0;
      this.form.cantiad_personas = 0;
    },

    prestador_id: {
      handler(valor) {
        if (valor) {
          this.getSedes()
        }
      },
      immediate: true,
    },

    tarifa_id() {
      if (this.editar) {
        this.getTarifas();
        this.getSedes()
      }
    },
  },

  mounted() {
    this.getManualesTarifarios()
    //this.getSedes()
    if (this.editar) {
      this.getTarifas()
    }
  },

  methods: {
    ...mapActions('app', ['setPreload']),

    async submit() {
      try {
        this.setPreload(true);
        const request = {
          ...this.form,
          contrato_id: this.contrato_id,
        }
        if (this.editar) {
          await this.$axios.post('/tarifa/actualizar', request);
          this.$toast.success("La tarifa se actualizo correctamente.");
          this.limpiar();
          this.$emit("cerrar");
          this.$emit("submit");
        } else {
          await this.$axios.post('/tarifa', request);
          this.$toast.success("La tarifa se creo correctamente.");
          this.limpiar();
          this.$emit("cerrar");
          this.$emit("submit");
        }

      } catch (error) {
        this.errores = error.response.data
        this.$toast.error("Error al cargar los datos");
      } finally {
        this.setPreload(false);
      }
    },

    async getManualesTarifarios() {
      try {
        this.setPreload(true);
        const {
          data
        } = await this.$axios.get("/manual-tarifario");
        this.manuales_tarifarios = data;
      } catch (error) {
        this.$toast.error("Error al cargar los datos");
      } finally {
        this.setPreload(false);
      }
    },

    limpiar() {
      this.form.manual_tarifario_id = null;
      this.form.pleno = false;
      this.form.valor = 0;
      this.form.rep_id = null;
      this.form.cantiad_personas = 0;
      for (const key in this.errores) {
          this.errores[key] = ''
        }
    },

    /**
     * Obtiene las sedes
     */
    async getSedes() {
      try {
        if (!this.prestador_id) {
          return false;
        }
        this.loading = true;
        const {
          data
        } = await this.$axios.get("/reps/listar-por-prestador/" + this.prestador_id);
        this.reps = data.map((rep) => {
          return {
            id: rep.id,
            nombre: `${rep.nombre} - ${rep.municipio.nombre}`,
          }
        })
      } catch (error) {
        console.log('error')
      } finally {
        this.loading = false;
      }
    },

    getTarifas() {
       this.setPreload(true);
      const formData = new FormData();
      formData.append("tarifa_id", this.tarifa_id);
      this.$axios.post(
        "/tarifa/consultar-tarifa", formData).then(res => {
          this.form = res.data;
        }).catch(error => {
          this.$toast.error("Error");
        }).finally(() => {
          this.setPreload(false);
        });
    },

  },
};

</script>
