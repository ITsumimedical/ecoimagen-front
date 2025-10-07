<template>
  <div v-if="$can('empleado.crear')">
    <!-- DATOS CARACTERIZACIÓN BÁSICA -->
    <v-alert dense text color="blue-grey" icon="mdi-account-arrow-down" border="left"><b>Carcaterización básica</b>
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.primer_nombre" label="Primer nombre*"
          :error-messages="errors.primer_nombre">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.segundo_nombre" label="Segundo nombre"
          :error-messages="errors.segundo_nombre">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.primer_apellido" label="Primer apellido*"
          :error-messages="errors.primer_apellido">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.segundo_apellido" label="Segundo apellido"
          :error-messages="errors.segundo_apellido">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="tipoDocumento" v-model="empleado.tipo_documento_id"
          :error-messages="errors.tipo_documento_id" item-text="nombre" item-value="id"
          label="Tipo de documento identificación*">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.documento" type="number" label="Documento identificación*"
          :error-messages="errors.documento">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="municipios" v-model="empleado.municipio_expedicion_id"
          :error-messages="errors.municipio_expedicion_id" item-text="nombre" item-value="id"
          label="Municipio expedición documento*"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.fecha_expedicion_documento"
          :error-messages="errors.fecha_expedicion_documento" label="Fecha expedición documento*" type="date">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="municipios" v-model="empleado.municipio_nacimiento_id"
          :error-messages="errors.municipio_nacimiento_id" item-text="nombre" item-value="id"
          label="Municipio de nacimiento*"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.fecha_nacimiento" :error-messages="errors.fecha_nacimiento"
          label="Fecha nacimiento*" type="date">
        </v-text-field>
      </v-col>
    </v-row>
    <!-- DATOS DE CONTACTO -->
    <v-alert dense text color="blue-grey" icon="mdi-cellphone-arrow-down-variant" border="left"><b>Ubicación y
        contacto</b>
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="municipios" v-model="empleado.municipio_residencia_id"
          :error-messages="errors.municipio_residencia_id" item-text="nombre" item-value="id"
          label="Municipio residencia*"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.direccion_residencia" label="Dirección de residencia*"
          :error-messages="errors.direccion_residencia">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.barrio" label="Barrio residencia*" :error-messages="errors.barrio">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="empleado.area_residencia" :items="areasResidenciales" label="Área residencial*"
          :error-messages="errors.area_residencia">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.telefono" label="Teléfono fijo" hint="Prefijo colombia 604"
          :error-messages="errors.telefono">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.celular" type="number" label="Número celular*" hide-spin-buttons
          :error-messages="errors.celular">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.celular2" type="number" label="Número celular alternativo" hide-spin-buttons
          :error-messages="errors.celular2">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.email_personal" type="email" label="Correo personal*"
          :error-messages="errors.email_personal">
        </v-text-field>
      </v-col>
    </v-row>
    <!-- DATOS COMPLEMENTARIOS -->
    <v-alert dense text color="blue-grey" icon="mdi-dots-horizontal-circle-outline" border="left"><b>Complementarios</b>
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="empleado.email_corporativo" type="email" placeholder="@ejemplo.com"
          label="Correo institucional" :error-messages="errors.email_corporativo">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="sedes" v-model="empleado.sede_id" :error-messages="errors.sede_id"
          item-text="nombre" item-value="id" label="Sede principal*">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="areasTh" v-model="empleado.areath_id" :error-messages="errors.areath_id"
          item-text="nombre" item-value="id" label="Área | Proceso*">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="empleado.genero" :error-messages="errors.genero" :items="generos"
          label="Género nacimiento*">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="empleado.identidad_genero" :items="identidadesGeneros" label="Identidad de género*"
          :error-messages="errors.identidad_genero">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="orientaciones" v-model="empleado.orientacion_sexual_id"
          :error-messages="errors.orientacion_sexual_id" item-text="nombre" item-value="id" label="Orientación sexual*">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="empleado.estado_civil" :error-messages="errors.estado_civil" :items="estadosCiviles"
          label="Estado civil*">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field dense v-model="empleado.peso" type="number" label="Peso*" :error-messages="errors.peso"
          hint="Sólo números enteros">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-text-field dense v-model="empleado.altura" type="number" label="Altura*" :error-messages="errors.altura"
          hint="Sólo números enteros">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="empleado.rh" :items="rhs" label="Grupo sanguíneo*" :error-messages="errors.rh">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="empleado.grupo_etnico" :items="gruposEtnicos" label="Grupo étnico*"
          :error-messages="errors.grupo_etnico">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="empleado.nivel_estudio" :items="nivelesEstudios" label="Nivel estudio*"
          :error-messages="errors.nivel_estudio">
        </v-select>
      </v-col>
    </v-row>
    <v-alert dense text color="blue-grey" border="left" icon="mdi-playlist-check"><b>Adicionales</b></v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="12">
        <v-textarea auto-grow dense v-model="empleado.descripcion"
          label="Descripción adicional | Acerca de mí | Datos complementarios" :error-messages="errors.descripcion"
          hint="Campo para datos a tener en cuenta del empleado, relacionado con cualquier caracteristica particular">
        </v-textarea>
      </v-col>
      <!-- DATOS COMPLEMENTARIOS -->
      <v-col cols="12" sm="2" md="2">
        <v-switch dense v-model="empleado.medico" label="¿El empleado es un médico?">
        </v-switch>
      </v-col>
      <v-col v-show="empleado.medico == 1" cols="12" sm="6" md="4">
        <v-autocomplete chips deletable-chips small-chips multiple dense :items="especialidades"
          v-model="empleado.especialidad_id" :error-messages="errors.especialidad_id" item-text="nombre" item-value="id"
          label="Especialidad médica">
        </v-autocomplete>
      </v-col>
      <v-col v-show="empleado.medico == 1" cols="12" sm="6" md="4">
        <v-text-field dense v-model="empleado.registro_medico" label="Registro médico"
          :error-messages="errors.registro_medico">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2" md="2">
        <v-switch dense v-model="empleado.cabeza_hogar" label="Cabeza de hogar">
        </v-switch>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <v-switch dense v-model="empleado.discapacidad" label="¿Posee alguna discapacidad?">
        </v-switch>
      </v-col>
      <v-col v-show="empleado.discapacidad == 1" cols="12" sm="6" md="4">
        <v-textarea auto-grow dense v-model="empleado.descripcion_discapacidad"
          label="Descripción discapacidad o condición especial" hint="Describa la discapacidad que posee el empleado">
        </v-textarea>
      </v-col>
      <v-col v-show="empleado.discapacidad == 1" cols="12" sm="6" md="4">
        <v-textarea dense auto-grow v-model="empleado.ajuste_puesto" label="Ajuste del puesto de trabajo"
          hint="Describa los ajustes necesarios del puesto de trabajo para el óptimo cumplimiento de las funciones del empleado según su discapacidad">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <v-switch dense v-model="empleado.victima" class="text-sm-justify"
          label="Ha sido víctima de desplazamiento forzoso, violencia sexual o de género?">
        </v-switch>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small color="boton" dark @click="guardarEmpleado()">
        Crear
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
  import {
    mapActions
  } from "vuex"
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('empleado.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonGuardarEmpleadoComponente',

    data() {
      return {
        buscarEmpleado: '',
        areasResidenciales: ['Urbano', 'Rural'],
        estadosCiviles: ['Soltero', 'Casado', 'Unión libre', 'Viudo', 'No refiere'],
        generos: ['Masculino', 'Femenino', 'No refiere'],
        rhs: ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'],
        gruposEtnicos: ['Afrocolombiano', 'Raizal', 'Palenquero', 'Indígena', 'Caucásico', 'Sin pertenencia étnica'],
        nivelesEstudios: ['Básica primaria', 'Básica secundaria', 'Bachillerato', 'Técnico', 'Tecnólogo',
          'Profesional', 'Especialización', 'Maestría', 'Doctorado'
        ],
        identidadesGeneros: ['Hombre', 'Mujer', 'Binario', 'No Binario', 'No refiere'],
        dialogCrearEmpleado: false,
        empleado: {
          primer_nombre: '',
          segundo_nombre: '',
          primer_apellido: '',
          segundo_apellido: '',
          descripcion: '',
          documento: '',
          fecha_nacimiento: '',
          fecha_expedicion_documento: '',
          direccion_residencia: '',
          celular: '',
          email_personal: '',
          email_corporativo: '',
          tipo_documento_id: '',
          municipio_expedicion_id: '',
          areath_id: '',
          sede_id: '',
          email: '',
          municipio_residencia_id: '',
          municipio_nacimiento_id: '',
          genero: '',
          orientacion_sexual_id: '',
          identidad_genero: '',
          estado_civil: '',
          barrio: '',
          telefono: '',
          celular2: '',
          cabeza_hogar: false,
          area_residencia: '',
          peso: '',
          altura: '',
          rh: '',
          victima: false,
          grupo_etnico: '',
          nivel_estudio: '',
          victima: false,
          discapacidad: false,
          descripcion_discapacidad: '',
          ajuste_puesto: '',
          especialidad_id: '',
          medico: false,
          registro_medico: '',
          estado_id: 1,
        },
        editedIndex: -1,
        defecto: {
          primer_nombre: '',
          segundo_nombre: '',
          primer_apellido: '',
          segundo_apellido: '',
          descripcion: '',
          documento: '',
          fecha_nacimiento: '',
          fecha_expedicion_documento: '',
          direccion_residencia: '',
          celular: '',
          email_personal: '',
          email_corporativo: '',
          sede_id: '',
          tipo_documento_id: '',
          email: '',
          municipio_residencia_id: '',
          municipio_nacimiento_id: '',
          genero: '',
          identidad_genero: '',
          orientacion_sexual_id: '',
          estado_civil: '',
          barrio: '',
          telefono: '',
          celular2: '',
          cabeza_hogar: false,
          area_residencia: '',
          peso: '',
          altura: '',
          rh: '',
          areath_id: '',
          victima: false,
          grupo_etnico: '',
          nivel_estudio: '',
          victima: false,
          discapacidad: false,
          descripcion_discapacidad: '',
          ajuste_puesto: '',
          especialidad_id: '',
          medico: false,
          registro_medico: '',
        },
        errors: {
          primer_nombre: '',
          segundo_nombre: '',
          primer_apellido: '',
          segundo_apellido: '',
          descripcion: '',
          documento: '',
          fecha_nacimiento: '',
          fecha_expedicion_documento: '',
          direccion_residencia: '',
          barrio: '',
          celular: '',
          email_personal: '',
          email_corporativo: '',
          orientacion_sexual_id: '',
          nivel_estudio: '',
          grupo_etnico: '',
          tipo_documento_id: '',
          municipio_expedicion_id: '',
          areath_id: '',
          sede_id: '',
          area_residencia: '',
          email: '',
          municipio_residencia_id: '',
          municipio_nacimiento_id: '',
          genero: '',
          identidad_genero: '',
          estado_civil: '',
          peso: '',
          altura: '',
          especialidad_id: '',
          medico: false,
          rh: '',
          telefono: '',
          celular2: '',
          registro_medico: '',
        },
        paginate: {
          total: 0,
          page: 1
        },
        headersEmpleados: [{
            text: 'id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Documento',
            value: 'documento'
          },
          {
            text: 'Nombres y apellidos',
            value: 'nombre_completo',
          },
          {
            text: 'Celular',
            value: 'celular',
          },
          {
            text: 'Correo corporativo',
            value: 'email_corporativo',
          },
          {
            text: 'Estado',
            value: 'estado_id'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        loading: false,
        tipoDocumento: [],
        municipios: [],
        especialidades: [],
        orientaciones: [],
        sedes: [],
        empleados: [],
        areasTh: [],
      };
    },

    mounted() {
      this.listarTipoDocumento()
      this.listarMunicipios()
      this.listarEmpleados()
      this.listarAreasTh()
      this.listarEspecialidad()
      this.listarOrientaciones()
      this.listarSedes()
    },

    watch: {
      dialogCrearEmpleado(val) {
        val || this.cerrarDialogo
      },
      "empleado.altura": function () {
        this.calcularImc();
      },
      "empleado.peso": function () {
        this.calcularImc();
      }
    },

    methods: {

      ...mapActions("app", ["setPreload"]),

      listarTipoDocumento() {
        this.setPreload(true)
        this.$axios.get("/tipo-documento/listar").then((res) => {
          this.tipoDocumento = res.data;
        }).catch((error) => {
          this.$toast.error(
            "Ocurrió un error al cargar los tipos de documento"
          );
          console.log(error);
        }).finally(() => {
          this.setPreload(false);
        });
      },

      cerrarDialogo() {
        this.dialogCrearEmpleado = false
        this.limpiarError()
        this.$nextTick(() => {
          this.empleado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
      },

      calcularImc() {
        this.empleado.indice_masa_corporal = this.empleado.peso / Math.pow(this.empleado.altura /
          100, 2).toFixed(2);
        this.empleado.indice_masa_corporal = parseFloat(this.empleado.indice_masa_corporal).toFixed(1);
      },

      listarEmpleados() {
        this.setPreload(true)
        this.$axios.get("/empleados/listar").then((res) => {
          this.empleados = res.data;
        }).catch((error) => {
          this.$toast.error(
            "Ocurrió un error al cargar los tipos de documento"
          );
          console.log(error);
          if (error = 202) {
            this.$toast.error(
              'No tiene permisos para listar los empleados'
            )
          }
        }).finally(() => {
          this.setPreload(false);
        });
      },

      guardarEmpleado() {
        this.setPreload(true);
        this.limpiarError()
        this.$axios.post("empleados/crear", this.empleado).then((res) => {
            return this.$toast.success('Se ha creado el empleado correctamente!.')
          })
          .catch((e) => {
            this.$toast.error("Ocurrió un error al tratar de crear el empleado");
            this.ErrorEntrada(e.response.data)
          }).finally(() => {
            this.setPreload(false);
          });
      },

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      listarMunicipios() {
        this.$axios.get("/municipios/listar").then((res) => {
            this.municipios = res.data;
          })
          .catch((error) => {
            this.$toast.error(
              "Ocurrió un error al cargar los minucipios"
            );
            console.log(error);
          })
      },

      listarEspecialidad() {
        this.setPreload(true)
        this.$axios.get("/especialidades/especialidadesEmpleados").then((res) => {
            this.especialidades = res.data;
          })
          .catch((error) => {
            this.$toast.error(
              "Ocurrió un error al cargar las especialidades"
            );
            console.log(error);
          }).finally(() => {
            this.setPreload(false);
          });
      },

      listarOrientaciones() {
        this.setPreload(true)
        this.$axios.get("/orientaciones-sexuales/listar").then((res) => {
            this.orientaciones = res.data.data;
          })
          .catch((error) => {
            this.$toast.error(
              "Ocurrió un error al cargar las orientaciones sexuales"
            );
            console.log(error);
          }).finally(() => {
            this.setPreload(false);
          });
      },

      listarSedes() {
        this.setPreload(true)
        this.$axios.get('/sede/listar').then(res => {
          this.sedes = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        }).finally(() => {
          this.setPreload(false);
        });
      },

      listarAreasTh() {
        this.setPreload(true)
        this.$axios.get('/areasTh/listar').then(res => {
          this.areasTh = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        }).finally(() => {
          this.setPreload(false);
        });
      },

    },
  };

</script>

<style lang="scss" scoped>
  .v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
  }

  .left {
    justify-content: left
  }

</style>
