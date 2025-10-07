<template>
  <v-card>
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

    <!-- titulo de la card -->
    <v-card-title class="titulo black--text">
      <span>{{ editar ? "Editar" : "Crear" }} Prestador</span>
    </v-card-title>

    <!-- formulario -->
    <form @submit.prevent="submit">
      <v-card-text>
        <v-row dense>
          <v-col sm="12" md="4">
            <v-autocomplete
              dense
              v-model="form.tipo_prestador_id"
              :items="tipoPrestador"
              item-text="nombre"
              item-value="id"
              label="Tipo prestador *"
              :error-messages="errores.tipo_prestador_id"
            ></v-autocomplete>
          </v-col>

          <v-col sm="12" md="8">
            <v-text-field
              dense
              v-model="form.nombre_prestador"
              label="Nombre *"
              :error-messages="errores.nombre_prestador"
            ></v-text-field>
          </v-col>

          <v-col sm="12" md="4">
            <v-text-field
              dense
              v-model="form.nit"
              label="Nit *"
              :error-messages="errores.nit"
            ></v-text-field>
          </v-col>

          <v-col sm="12" md="8">
            <v-text-field
              dense
              v-model="form.razon_social"
              label="Razon Social *"
              :error-messages="errores.razon_social"
            ></v-text-field>
          </v-col>

          <v-col sm="12" md="8">
            <v-autocomplete
              dense
              :items="clasePrestador"
              v-model="form.clase_prestador"
              label="Clase prestador"
              :error-messages="errores.clase_prestador"
            ></v-autocomplete>
          </v-col>

          <v-col sm="12" md="4">
            <v-autocomplete
              dense
              :items="siNo"
              item-text="nombre"
              item-value="nombre"
              v-model="form.empresa_social"
              label="Empresa social *"
              :error-messages="errores.empresa_social"
            ></v-autocomplete>
          </v-col>

          <v-col sm="12" md="4">
            <v-autocomplete
              dense
              v-model="form.municipio_id"
              :items="municipios"
              item-text="nombre"
              item-value="id"
              label="Municipio *"
              :error-messages="errores.municipio_id"
            ></v-autocomplete>
          </v-col>

          <v-col sm="12" md="4">
            <v-autocomplete
              dense
              :items="caracteres"
              v-model="form.caracter"
              label="Caracter"
              :error-messages="errores.caracter"
            ></v-autocomplete>
          </v-col>
          <v-col sm="12" md="4">
            <v-autocomplete
              dense
              :items="juridica"
              v-model="form.naturaleza_juridica"
              label="Naturaleza juridica"
              :error-messages="errores.naturaleza_juridica"
            ></v-autocomplete>
          </v-col>
          <v-col sm="12" md="12">
            <v-text-field
              dense
              v-model="form.direccion"
              label="Dirección *"
              :error-messages="errores.direccion"
            ></v-text-field>
          </v-col>

          <v-col sm="12" md="6">
            <v-text-field
              dense
              v-model="form.correo1"
              label="Correo 1 *"
              :error-messages="errores.correo1"
            ></v-text-field>
          </v-col>

          <v-col sm="12" md="6">
            <v-text-field
              dense
              v-model="form.correo2"
              label="Correo 2"
              :error-messages="errores.correo2"
            ></v-text-field>
          </v-col>

          <v-col sm="12" md="6">
            <v-text-field
              dense
              v-model="form.telefono1"
              label="Telefono 1 *"
              type="number"
              :error-messages="errores.telefono1"
            ></v-text-field>
          </v-col>

          <v-col sm="12" md="6">
            <v-text-field
              dense
              v-model="form.telefono2"
              label="Telefono 2"
              type="number"
              :error-messages="errores.telefono2"
            >
            </v-text-field>
          </v-col>

          <v-col sm="12" md="10">
            <v-text-field
              dense
              v-model="form.codigo_habilitacion"
              label="Codigo prestador *"
              :error-messages="errores.codigo_habilitacion"
            ></v-text-field>
          </v-col>

          <v-col sm="12" md="2">
            <v-text-field
              dense
              v-model="form.nivel"
              label="Nivel"
              :error-messages="errores.nivel"
            ></v-text-field>
          </v-col>

          <p>Campos obligatorios *</p>
        </v-row>
      </v-card-text>

      <!-- boton de acciones limpiar formulario y enviar formulario -->
      <v-card-actions class="justify-end">
        <v-btn small @click="limpiar()" color="error">cerrar</v-btn>

        <v-btn small type="submit" color="success" dark>{{
            editar ? "Actualizar" : "Guardar"
          }}
        </v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>
<script>
export default {
  middleware({$can, redirect}) {
    if (!$can("contrato.prestadores.vista")) {
      return redirect("/");
    }
  },

  name: "FormPrestador",

  // props que recibe del padre
  props: {
    editar: {
      type: Boolean,
      default: false,
    },
    prestador_id: {
      type: Number,
      default: null,
    },
  },

  // observador que indica cuando es editar o cuando es crear
  watch: {
    prestador_id() {
      if (this.editar) {
        this.getPrestador();
      }
    },
  },

  mounted() {
    if (this.editar) {
      this.getPrestador();
    }
    this.getMunicipios();
    this.getTipoPrestador();
  },

  data() {
    return {
      form: {
        nombre_prestador: null,
        municipio_id: null,
        nit: null,
        direccion: null,
        correo1: null,
        correo2: null,
        telefono1: null,
        telefono2: null,
        capitado: null,
        codigo_habilitacion: null,
        tipo_prestador_id: null,
        razon_social: null,
        clase_prestador: null,
        empresa_social: null,
        caracter: null,
        naturaleza_juridica: null,
        nivel: null,
      },
      errores: {
        nombre_prestador: null,
        municipio_id: null,
        nit: null,
        direccion: null,
        correo1: null,
        correo2: null,
        telefono1: null,
        telefono2: null,
        capitado: null,
        codigo_habilitacion: null,
        tipo_prestador_id: null,
        razon_social: null,
        clase_prestador: null,
        empresa_social: null,
        caracter: null,
        naturaleza_juridica: null,
        nivel: null,
      },
      preload: false,
      siNo: [
        {
          nombre: "Si",
          value: 1,
        },
        {
          nombre: "No",
          value: 0,
        },
      ],
      caracteres:['Nacional','Departamental','Distrital','Municipal','Indigena'],
      juridica:['Privada','Mixta','Publica'],
      clasePrestador:['Instituciones Prestadoras de Servicios de Salud - IPS','Profesional Independiente','Transporte Especial de Pacientes','Objeto Social Diferente a la Prestacion de Servicios de Salud'],
      errors: {
        nombre: "",
      },
      tipoPrestador: [],
      municipios: []
    };
  },

  methods: {
    /*
    ! guardar o actualizar prestadores
    * @author Kobatime
    */
    async submit() {
      this.limpiarError();
      this.preload = true;
      try {
        if (this.editar) {
          await this.$axios.put("/prestador/" + this.prestador_id, this.form);
          this.$toast.success("Prestador actualizado correctamente.");
        } else {
          await this.$axios.post("/prestador", this.form);
          this.$toast.success("El prestador se creó correctamente.");
        }
        this.limpiar();
        this.preload = false;
        this.$emit("cerrar");
      } catch (error) {
        this.preload = false;
        if (error.response.status === 422) {
          this.pintarErrores(error.response.data);
        }
      }
    },

    async getMunicipios() {
      try {
        const {data} = await this.$axios.get("/municipios/listar");
        this.municipios = data;
      } catch (error) {
        this.$toast.error("Problemas al consultar los municipios.");
      }
    },


    /*
    ! consultar prestador
    * @type async
    * @return object form
    * @author Kobatime
    */
    async getPrestador() {
      try {
        const response = await this.$axios.get(
          "/prestador/consultar/" + this.prestador_id + "?clave=id"
        );
        this.form.nombre_prestador = response.data.nombre_prestador;
        this.form.nit = response.data.nit;
        this.form.direccion = response.data.direccion;
        this.form.correo1 = response.data.correo1;
        this.form.correo2 = response.data.correo2;
        this.form.telefono1 = response.data.telefono1;
        this.form.telefono2 = response.data.telefono2;
        this.form.capitado = parseInt(response.data.capitado);
        this.form.codigo_habilitacion = response.data.codigo_habilitacion;
        this.form.tipo_prestador_id = parseInt(response.data.tipo_prestador_id);
        this.form.municipio_id = parseInt(response.data.municipio_id);
        this.form.naturaleza_juridica  = response.data.naturaleza_juridica;
        this.form.nivel = response.data.nivel;
        this.form.caracter = response.data.caracter;
        this.form.razon_social = response.data.razon_social;
        this.form.clase_prestador = response.data.clase_prestador;
        this.form.empresa_social = response.data.empresa_social;
      } catch (error) {
      }
    },

    /*
    ! limpiar form
    * @return object form
    * @author Kobatime
    */
    limpiar() {
      for (const prop of Object.getOwnPropertyNames(this.form)) {
        this.form[prop] = null;
      }
      this.$emit('cerrar');
      this.limpiarError();
    },

    /*
    ! buscar tipo prestador
    * @type async
    * @return object tipoPrestador
    * @author Kobatime
    */
    async getTipoPrestador() {
      try {
        const {data} = await this.$axios.get("/tipo-prestador");
        this.tipoPrestador = data;
      } catch (error) {
      }
    },

    /*
    ! valida errores del form
    * @return object errores
    * @author Kobatime
    */
    pintarErrores(errores) {
      for (const key in this.errores) {
        if (key in errores) {
          this.errores[key] = errores[key].join(", ");
        }
      }
    },

    /*
    ! limpia errores del form
    * @return object errores
    * @author Kobatime
    */
    limpiarError() {
      for (const key in this.errores) {
        this.errores[key] = "";
      }
    },
  },
};
</script>
