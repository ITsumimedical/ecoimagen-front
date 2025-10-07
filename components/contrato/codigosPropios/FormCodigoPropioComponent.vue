<template>
  <v-card>
    <!-- Preload -->
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <v-card-title class="titulo black--text">
      {{ editar ? "Editar" : "Crear" }} Codigo Propio
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="submit">
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="3">
              <v-text-field dense outlined v-model="form.codigo" label="Codigo propio *"
                :error-messages="errors.codigo">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="9">
              <v-text-field dense v-model="form.nombre" label="Nombre del codigo propio*"
                :error-messages="errors.nombre" outlined>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <v-autocomplete dense :items="cups" item-value="id" :item-text="cupsLista" v-model="form.cup_id"
                label="Cup asociado *" :error-messages="errors.cup_id" outlined></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-autocomplete dense :items="['A', 'F', 'M']" v-model="form.genero" label="Genero *"
                :error-messages="errors.genero"></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-text-field dense v-model="form.edad_inicial" type="number" label="Edad inicial *"
                :error-messages="errors.edad_inicial"></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-text-field dense v-model="form.edad_final" type="number" label="Edad final *"
                :error-messages="errors.edad_final"></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-select dense v-model="form.quirurgico" :items="siNo" item-text="nombre" item-value="value"
                label="Quirurgico *" :error-messages="errors.quirurgico"></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-select dense v-model="form.diagnostico_requerido" :items="siNo" item-text="nombre" item-value="value"
                label="Diagnostico requerido *" :error-messages="errors.diagnostico_requerido"></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-autocomplete dense :items="niveles_ordenamiento" v-model="form.nivel_ordenamiento"
                label="Nivel ordenamiento *" :error-messages="errors.nivel_ordenamiento"></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-autocomplete dense :items="niveles_portabilidad" v-model="form.nivel_portabilidad"
                label="Nivel portabilidad" :error-messages="errors.nivel_portabilidad"></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-select dense v-model="form.requiere_auditoria" :items="siNo" item-text="nombre" item-value="value"
                label="Requiere auditoria *" :error-messages="errors.requiere_auditoria"></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-text-field dense v-model="form.periodicidad" type="number" label="Periodocidad *"
                :error-messages="errors.periodicidad"></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-text-field dense v-model.number="form.valor" label="valor *" :error-messages="errors.valor">
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-text-field dense v-model="form.cantidad_max_ordenamiento" type="number"
                label="Cantidad Maxima de ordenamiento *"
                :error-messages="errors.cantidad_max_ordenamiento"></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="4">
              <v-autocomplete dense v-model="form.ambito_id" :items="ambitos" item-text="nombre" item-value="id"
                label="Ambito *" :error-messages="errors.ambito_id">
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <p>Campos obligatorios *</p>
        <v-card-actions class="justify-end">
          <v-btn color="error" @click="$emit('cerrar'), limpiar()">cerrar</v-btn>
          <v-btn color="primary" type="submit">{{
            editar ? "Editar" : "Crear"
            }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
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
  name: "form-codigo-propio",

  props: {
    editar: Boolean,
    codigo_propio_id: Number,
  },

  watch: {
    codigo_propio_id() {
      if (this.editar) {
        this.getCodigoPropio();
      }
    },
  },

  data() {
    return {
      cups: [],
      ambitos: [],
      codigos_propios: [],
      preload: false,
      siNo: [
        {
          nombre: "Si",
          value: "1",
        },
        {
          nombre: "No",
          value: "0",
        },
      ],
      niveles_ordenamiento: ['0', '1', '2', '3', '4'],
      niveles_portabilidad: ['0', '1', '2', '3', '4'],
      form: {
        nombre: null,
        cup_id: null,
        codigo: null,
        genero: null,
        edad_inicial: null,
        edad_final: null,
        archivo: null,
        quirurgico: null,
        diagnostico_requerido: null,
        nivel_ordenamiento: null,
        nivel_portabilidad: null,
        requiere_auditoria: null,
        periodicidad: null,
        cantidad_max_ordenamiento: null,
        ambito_id: null,
        valor: null,
      },
      errors: {
        nombre: null,
        cup_id: null,
        codigo: null,
        genero: null,
        edad_inicial: null,
        edad_final: null,
        archivo: null,
        quirurgico: null,
        diagnostico_requerido: null,
        nivel_ordenamiento: null,
        nivel_portabilidad: null,
        requiere_auditoria: null,
        periodicidad: null,
        cantidad_max_ordenamiento: null,
        ambito_id: null,
        valor: null,
      },
    };
  },

  mounted() {
    this.getCups();
    this.getAmbitos();
    if (this.editar) {
      this.getCodigoPropio();
    }
  },

  methods: {
    async submit() {
      this.preload = true;
      this.limpiarError();
      try {
        if (this.editar) {
          await this.$axios.put(
            "/codigo-propio/" + this.codigo_propio_id,
            this.form
          );
          this.preload = false;
          this.$toast.success("El codigo propio se edito correctamente.");
          this.limpiarError();
        } else {
          this.preload = true;
          await this.$axios.post("/codigo-propio", this.form);
          this.$toast.success("El codigo propio se creo correctamente.");
        }
        this.limpiar();
        this.preload = false;
        this.limpiarError();
        this.$emit("cerrar");
        this.$emit("submit");
      } catch (error) {
        this.preload = false;
        this.ErrorEntrada(error.response.data);
      }
    },

    async getCodigoPropio() {
      this.preload = true;
      try {
        const { data } = await this.$axios.get(
          "/codigo-propio/" + this.codigo_propio_id
        );
        this.preload = false;
        this.form.nombre = data.nombre;
        this.form.cup_id = data.cup.id;
        this.form.codigo = data.codigo;
        this.form.genero = data.genero;
        this.form.edad_inicial = data.edad_inicial;
        this.form.edad_final = data.edad_final;
        this.form.archivo = data.archivo;
        this.form.quirurgico = data.quirurgico;
        this.form.diagnostico_requerido = data.diagnostico_requerido;
        this.form.nivel_ordenamiento = data.nivel_ordenamiento;
        this.form.nivel_portabilidad = data.nivel_portabilidad;
        this.form.requiere_auditoria = data.requiere_auditoria;
        this.form.periodicidad = data.periodicidad;
        this.form.cantidad_max_ordenamiento = data.cantidad_max_ordenamiento;
        this.form.ambito_id = parseInt(data.ambito_id);
        this.form.valor = parseInt(data.valor);
      } catch (error) {
        this.preload = false;
        console.log("error al consultar el codigo");
      }
    },

    async getCups() {
      try {
        const { data } = await this.$axios.get("/cup");
        this.cups = data.data;
      } catch (error) {
        this.$toast.error("Error al consultar los cups.");
      }
    },

    cupsLista(item){
      return `${item.codigo} - ${item.nombre} `;

    },

    limpiar() {
      this.form.codigo = null;
      this.form.nombre = null;
      this.form.cup_id = null;
      this.form.genero = null;
      this.form.edad_inicial = null;
      this.form.edad_final = null;
      this.form.quirurgico = null;
      this.form.diagnostico_requerido = null;
      this.form.nivel_ordenamiento = null;
      this.form.nivel_portabilidad = null;
      this.form.requiere_auditoria = null;
      this.form.periodicidad = null;
      this.form.valor = null;
      this.form.cantidad_max_ordenamiento = null;
      this.form.ambito_id = null;
      this.limpiarError();
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
      this.errors.cup_id = null;
      this.errors.codigo = null;
      this.errors.genero = null;
      this.errors.edad_inicial = null;
      this.errors.edad_final = null;
      this.errors.archivo = null;
      this.errors.quirurgico = null;
      this.errors.diagnostico_requerido = null;
      this.errors.nivel_ordenamiento = null;
      this.errors.nivel_portabilidad = null;
      this.errors.requiere_auditoria = null;
      this.errors.periodicidad = null;
      this.errors.cantidad_max_ordenamiento = null;
      this.errors.ambito_id = null;
      this.errors.valor = null;
    },

    async getAmbitos() {
      try {
        const response = await this.$axios.get("/ambito");
        this.ambitos = response.data;
      } catch (error) { }
    },
  },
};
</script>
