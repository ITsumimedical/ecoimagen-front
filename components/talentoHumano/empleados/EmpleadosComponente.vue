<template>
  <div>
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
    <v-card-text>
    </v-card-text>
    <v-alert border="left" icon="mdi-account-file-text" dense text color="blue-grey"><b>Carcaterización básica</b>
    </v-alert>
    <!-- DATOS DE CATCARERIZACIÓN BÁSICA -->
    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.primer_nombre" label="Primer nombre"
          :error-messages="errors.primer_nombre">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.segundo_nombre" label="Segundo nombre"
          :error-messages="errors.segundo_nombre">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.primer_apellido" label="Primer apellido"
          :error-messages="errors.primer_apellido">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.segundo_apellido" label="Segundo apellido"
          :error-messages="errors.segundo_apellido">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="tipoDocumento" v-model="datosEmpleado.tipo_documento_id"
          :error-messages="errors.tipo_documento_id" item-text="nombre" item-value="id" label="Tipo de documento">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.documento" type="number" label="Documento"
          :error-messages="errors.documento">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="municipios" v-model="datosEmpleado.municipio_expedicion_id"
          :error-messages="errors.municipio_expedicion_id" item-text="nombre" item-value="id"
          label="Municipio expedición"></v-autocomplete>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.fecha_expedicion_documento"
          :error-messages="errors.fecha_expedicion_documento" label="Fecha expedición documento" type="date">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="municipios" v-model="datosEmpleado.municipio_nacimiento_id"
          :error-messages="errors.municipio_nacimiento_id" item-text="nombre" item-value="id"
          label="Municipio de nacimiento"></v-autocomplete>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.fecha_nacimiento" :error-messages="errors.fecha_nacimiento"
          label="Fecha nacimiento" type="date">
        </v-text-field>
      </v-col>
    </v-row>
    <v-alert border="left" icon="mdi-card-account-phone" dense text color="blue-grey"><b>Ubicación y contacto</b>
    </v-alert>
    <!-- DATOS DE CONTACTO -->
    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="municipios" v-model="datosEmpleado.municipio_residencia_id"
          :error-messages="errors.municipio_residencia_id" item-text="nombre" item-value="id"
          label="Municipio residencia"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.direccion_residencia" label="Dirección de residencia"
          :error-messages="errors.direccion_residencia">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.barrio" label="Barrio residencia" :error-messages="errors.barrio">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="datosEmpleado.area_residencia" :items="areasResidenciales" label="Área residencial"
          :error-messages="errors.area_residencia">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.telefono" label="Teléfono" hint="Prefijo Colombia 604"
          :error-messages="errors.telefono">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.celular" type="number" label="Número celular"
          :error-messages="errors.celular">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.celular2" type="number" label="Número celular alternativo"
          hint="alternativo" :error-messages="errors.celular2">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.email_personal" type="email" label="Correo personal"
          :error-messages="errors.email_personal">
        </v-text-field>
      </v-col>
    </v-row>
    <!-- DATOS COMPLEMENTARIOS -->
    <v-alert border="left" icon="mdi-account-eye" dense text color="blue-grey"><b>Complementarios</b></v-alert>
    <v-row dense>
      <v-col hidden cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.email" type="email" placeholder="@ejemplo.com"
          label="Usuario ingreso plataforma (Correo)" :error-messages="errors.email">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.email_corporativo" type="email" placeholder="@ejemplo.com"
          label="Correo corporativo" :error-messages="errors.email_corporativo">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="sedes" v-model="datosEmpleado.sede_id" :error-messages="errors.sede_id"
          item-text="nombre" item-value="id" label="Sede principal">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="areasTh" v-model="datosEmpleado.areath_id" :error-messages="errors.areath_id"
          item-text="nombre" item-value="id" label="Área | Proceso">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="datosEmpleado.genero" :error-messages="errors.genero" :items="generos"
          label="Género nacimiento">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="datosEmpleado.identidad_genero" :items="identidadesGeneros" label="Identidad de género"
          :error-messages="errors.identidad_genero">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="orientaciones" v-model="datosEmpleado.orientacion_sexual_id"
          :error-messages="errors.orientacion_sexual_id" item-text="nombre" item-value="id" label="Orientación sexual">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select dense v-model="datosEmpleado.estado_civil" :error-messages="errors.estado_civil"
          :items="estadosCiviles" label="Estado civil">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field dense v-model="datosEmpleado.peso" type="number" label="Peso (kg)" :error-messages="errors.peso"
          hint="Sólo números enteros">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="1">
        <v-text-field dense v-model="datosEmpleado.altura" type="number" label="Altura (cm)"
          :error-messages="errors.altura" hint="Sólo números enteros">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select dense v-model="datosEmpleado.rh" :items="rhs" label="Grupo sanguíneo" :error-messages="errors.rh">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="datosEmpleado.grupo_etnico" :items="gruposEtnicos" label="Grupo étnico"
          :error-messages="errors.grupo_etnico">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select dense v-model="datosEmpleado.nivel_estudio" :items="nivelesEstudios" label="Nivel estudio"
          :error-messages="errors.nivel_estudio">
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="jefesInmediatos" v-model="datosEmpleado.jefe_inmediato_id"
          :error-messages="errors.jefe_inmediato_id" item-text="nombre_completo" item-value="user_id"
          label="Jefe inmediato">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete dense :items="tiposPlantillas" v-model="datosEmpleado.th_tipo_plantilla_id"
          :error-messages="errors.th_tipo_plantilla_id" item-text="nombre" item-value="id"
          label="Tipo de plantilla evaluación desempeño">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="12">
        <v-autocomplete dense v-model="datosEmpleado.proyecto_empleado_id" :items="proyectos" item-text="nombre"
          label="Proyecto" item-value="id" chips deletable-chips multiple :error-messages="errors.proyecto_empleado_id">
        </v-autocomplete>
      </v-col>
    </v-row>
    <!-- DATOS ADICIONALES -->
    <v-alert border="left" icon="mdi-tooltip-account" color="blue-grey" dense text type="info"><b>Adicional</b>
    </v-alert>
    <v-row dense>
      <v-col cols="12" sm="6" md="2">
        <v-switch dense v-model="datosEmpleado.cabeza_hogar" label="Cabeza hogar">
        </v-switch>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-switch dense v-model="datosEmpleado.medico" label="¿El empleado es un médico?">
        </v-switch>
      </v-col>
      <v-col v-show="datosEmpleado.medico == 1" cols="12" sm="6" md="4">
        <v-autocomplete multiple chips small-chips deletable-chips dense :items="especialidades"
          v-model="datosEmpleado.especialidad_id" :error-messages="errors.especialidad_id" item-text="nombre"
          item-value="id" label="Especialidad médica">
        </v-autocomplete>
      </v-col>
      <v-col v-show="datosEmpleado.medico == 1" cols="12" sm="6" md="3">
        <v-text-field dense v-model="datosEmpleado.registro_medico" label="Registro médico"
          :error-messages="errors.registro_medico">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-switch dense v-model="datosEmpleado.victima" class="text-sm-justify"
          label="¿Ha sido víctima de desplazamiento forzoso, violencia sexual o de género?">
        </v-switch>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-switch dense v-model="datosEmpleado.discapacidad" label="¿El empleado posee alguna discapacidad?">
        </v-switch>
      </v-col>
      <v-col v-show="datosEmpleado.discapacidad == 1" cols="12" sm="6" md="6">
        <v-textarea auto-grow dense v-model="datosEmpleado.descripcion_discapacidad"
          label="Descripción discapacidad o condición especial" hint="Describa la discapacidad que posee el empleado">
        </v-textarea>
      </v-col>
      <v-col v-show="datosEmpleado.discapacidad == 1" cols="12" sm="6" md="6">
        <v-textarea auto-grow dense v-model="datosEmpleado.ajuste_puesto" label="Ajuste del puesto de trabajo"
          hint="Describa los ajustes necesarios del puesto de trabajo para el óptimo cumplimiento de las funciones del empleado según su discapacidad">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="12">
        <v-textarea auto-grow dense v-model="datosEmpleado.descripcion"
          label="Descripción adicional | Acerca de mí | Datos complementarios"
          hint="Campo para datos a tener en cuenta del empleado, relacionado con cualquier caracteristica particular"
          :error-messages="errors.descripcion">
        </v-textarea>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small class="white--text" color="boton" @click="guardarUsuario()">
        <b>Actualizar información</b>
      </v-btn>
    </v-card-actions>
    <!-- Datos complementarios -->
    <template>
      <div>
        <v-expansion-panels variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-header>
              CONTRATOS LABORALES
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ContratosComponente :empleado_id="datosEmpleado.id" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>CONTACTOS</v-expansion-panel-header>
            <v-expansion-panel-content>
              <ContactosComponente :empleado_id="datosEmpleado.id" />
              <GrupoFamiliarComponente :empleado_id="datosEmpleado.id" />
              <HijosEmpleadosComponente :empleado_id="datosEmpleado.id" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>ESTUDIOS</v-expansion-panel-header>
            <v-expansion-panel-content>
              <EstudiosComponente :empleado_id="datosEmpleado.id" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>ENCUESTA DE PERFIL SOCIODEMOGRÁFICO</v-expansion-panel-header>
            <v-expansion-panel-content>
              <PerfilSociodemograficoComponente :empleado_id="datosEmpleado.id" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarEmpleados,
    actualizarEmpleados,
  } from '@/api/empleados/empleado';
  import {
    listarTipoDocumento
  } from '@/api/tiposDocumentos/tipoDocumento';
  import {
    listarMunicipios
  } from "@/api/municipios/municipio";
  import {
    especialidadesEmpleados
  } from '@/api/especialidades/especialidad';
  import {
    listarOrientaciones
  } from '@/api/orientacionesSexuales/orientacionSexual';
  import ContactosComponente from './ContactosComponente.vue';
  import GrupoFamiliarComponente from './GrupoFamiliarComponente.vue';
  import HijosEmpleadosComponente from './HijosEmpleadosComponente.vue';
  import MascotasComponente from './MascotasComponente.vue';
  import ContratosComponente from './ContratosComponente.vue';
  import {
    descargarFile
  } from '@/api/descargar'
  import EstudiosComponente from './EstudiosComponente.vue';
  import PerfilSociodemograficoComponente from './PerfilSociodemograficoComponente.vue';

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('empleado.listar')) {
        return redirect('/');
      }
    },
    props: {
      datosEmpleado: Object
    },
    components: {
      ContactosComponente,
      GrupoFamiliarComponente,
      HijosEmpleadosComponente,
      MascotasComponente,
      ContratosComponente,
      EstudiosComponente,
      PerfilSociodemograficoComponente,
    },
    name: 'WorkspaceJsonEmpleadosComponente',

    data() {
      return {
        preload: false,
        buscarEmpleado: '',
        areasResidenciales: ['Urbano', 'Rural'],
        estadosCiviles: ['Soltero', 'Casado', 'Unión libre', 'Viudo', 'Divorciado', 'Separado', 'No refiere'],
        generos: ['Masculino', 'Femenino', 'No refiere'],
        rhs: ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'],
        gruposEtnicos: ['Afrocolombiano', 'Raizal', 'Palenquero', 'Indígena', 'Caucásico', 'Sin pertenencia étnica',
          'Mestizo'
        ],
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
          jefe_inmediato_id: '',
          th_tipo_plantilla_id: '',
          proyecto_empleado_id: ''
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
          jefe_inmediato_id: '',
          th_tipo_plantilla_id: '',
          proyecto_empleado_id: ''
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
          jefe_inmediato_id: '',
          th_tipo_plantilla_id: '',
        },
        datosProyectos: {
          empleado_id: '',
          proyecto_empleado_id: '',
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
        jefesInmediatos: [],
        municipios: [],
        especialidades: [],
        orientaciones: [],
        sedes: [],
        empleados: [],
        areasTh: [],
        tiposPlantillas: [],
        proyectos: [],
      };
    },

    created() {
      this.listarjefes()
      this.listarTipoDocumento()
      this.listarMunicipios()
      this.listarEmpleados()
      this.listarAreasTh()
      this.listarEspecialidad()
      this.listarOrientaciones()
      this.listarSedes()
      this.listarTiposPlantillas()
      this.listarProyectos()
    },
    computed: {

    },

    watch: {
      dialogCrearEmpleado(val) {
        val || this.cerrarDialogo
      },
      "datosEmpleado.altura": function () {
        this.calcularImc();
      },
      "datosEmpleado.peso": function () {
        this.calcularImc();
      }
    },

    methods: {
      cerrarDialogo() {
        this.dialogCrearEmpleado = false
        this.limpiarError()
        this.$nextTick(() => {
          this.empleado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
      },

      async excel() {
        const response = await this.$axios.get('/empleados/exportar', {
          responseType: 'blob'
        })
        descargarFile(response.data, 'empleados.xlsx')
      },

      exportarEmpleado() {
        this.$axios.get('/empleados/exportar').then(res => {
          this.empleados = res.data.data.data
        }).catch(error => {
          console.log(error)
        })
      },

      calcularImc() {
        this.empleado.indice_masa_corporal = this.empleado.peso / Math.pow(this.empleado.altura /
          100, 2).toFixed(2);
        this.empleado.indice_masa_corporal = parseFloat(this.empleado.indice_masa_corporal).toFixed(1);
      },

      listarProyectos() {
        this.$axios.get('/proyectos-empleados/listar').then(res => {
          this.proyectos = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      listarTipoDocumento() {
        this.$loadingGetRequest(listarTipoDocumento()).then(res => {
          this.tipoDocumento = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarjefes() {
        this.$axios.get('/empleados/listarEmpleadosContratados').then(res => {
          this.jefesInmediatos = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      async listarEmpleados() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarEmpleados(this.paginate.page))
          this.empleados = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      },

      async guardarUsuario() {
        this.limpiarError()
        this.preload = true
        try {
          if (this.empleado.medico === false) {
            this.empleado.especialidad_id = null
            this.empleado.registro_medico = null
          }
          if (this.datosEmpleado.proyecto_empleado_id) {
            this.datosProyectos.empleado_id = this.datosEmpleado.id
            console.log(this.datosEmpleado);
            this.datosProyectos.proyecto_empleado_id = parseInt(this.datosEmpleado.proyecto_empleado_id)
            this.$axios.post('/proyecto-empleados/crear', this.datosProyectos)
          }
          const {
            data
          } = await this.$loadingPutRequest(actualizarEmpleados(this.datosEmpleado.id), this.datosEmpleado)
          this.$toast.success('Empleado actualizado correctamente')
          this.preload = false
        } catch (error) {
          this.preload = false
          if (error.response.data.mensaje) {} else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
            return this.$swal({
              type: "error",
              title: "¡No se ha podido actualizar el empleado!",
              text: "Por favor valide los campos diligenciados",
            });
          }
        }
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

      chipEstado(estado_id) {
        if (estado_id == '1') return 'info'
        else if (estado_id == '0') return 'elerta'
        else return 'elerta'
      },

      listarMunicipios() {
        this.$loadingGetRequest(listarMunicipios()).then(res => {
          this.municipios = res.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarEspecialidad() {
        this.$loadingGetRequest(especialidadesEmpleados()).then(res => {
          this.especialidades = res.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarOrientaciones() {
        this.$loadingGetRequest(listarOrientaciones()).then(res => {
          this.orientaciones = res.data.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarSedes() {
        this.$axios.get('/sede/listar').then(res => {
          this.sedes = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarAreasTh() {
        this.$axios.get('/areasTh/listar').then(res => {
          this.areasTh = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarTiposPlantillas() {
        this.$axios.get('/th-tipo-plantillas/').then(res => {
          this.tiposPlantillas = res.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

    },
  };

</script>

<style>
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
