<template>
  <div>
    <v-card flat max-height="auto">
      <v-alert class="text-center" dense text border="left" color="info"
        ><b>PROCESO DE ACTUALIZACIÓN DE DATOS BÁSICOS FOMAG</b></v-alert
      >
      <v-form>
        <v-container fluid>
          <v-row dense align="center">
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Ingrese su número de documento"
                outlined
                v-model="documentoAfiliado"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="3" md="3">
              <v-text-field
                dense
                type="date"
                label="Ingrese su fecha de nacimiento"
                outlined
                v-model="fechaAfiliado"
              >
              </v-text-field>
            </v-col>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="mb-5"
                @click="consultarDatosAfiliado()"
                small
                dark
                color="info"
                >Consultar<v-icon right> mdi-magnify </v-icon>
              </v-btn>
              <v-btn class="mb-5" @click="limpiar()" small dark color="warning"
                >Otra Consulta<v-icon right>mdi-close </v-icon>
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-container>

        <v-card class="text-center" flat>
          <v-row v-if="verCampos == true" dense align-content="center">
            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title
                    ><b>Tipo de documento</b></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.tipo_documento
                        ? afiliadoConsultado.tipo_documento.nombre
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title
                    ><b>Número de documento</b></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.numero_documento
                        ? afiliadoConsultado.numero_documento
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title><b>Nombre completo</b></v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.nombre_completo
                        ? afiliadoConsultado.nombre_completo
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title><b>Entidad</b></v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      afiliadoConsultado.entidad
                        ? afiliadoConsultado.entidad.nombre
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title><b>Región</b></v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      afiliadoConsultado.region ? afiliadoConsultado.region : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title><b>Sexo</b></v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      afiliadoConsultado.sexo ? afiliadoConsultado.sexo : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title
                    ><b>Fecha de nacimiento</b></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.fecha_nacimiento
                        ? $moment(afiliadoConsultado.fecha_nacimiento).format(
                            "DD/MM/YYYY"
                          )
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title><b>Edad cumplida</b></v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      afiliadoConsultado.edad_cumplida
                        ? afiliadoConsultado.edad_cumplida
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title
                    ><b>Tipo de afiliación</b></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.tipo_afiliacion
                        ? afiliadoConsultado.tipo_afiliacion.nombre
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title><b>Tipo de afiliado</b></v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.tipo_afiliado
                        ? afiliadoConsultado.tipo_afiliado.nombre
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title
                    ><b>Estado de la afiliación</b></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.estado_afiliado
                        ? afiliadoConsultado.estado_afiliado.nombre
                        : ""
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title><b>Ciclo de vida</b></v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.ciclo_vida_atencion
                        ? afiliadoConsultado.ciclo_vida_atencion
                        : "Sin Calcular"
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title
                    ><b>Departamento de atención</b></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.departamento_atencion
                        ? afiliadoConsultado.departamento_atencion.nombre
                        : "Sin Departamento"
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title
                    ><b>Municipio de atención</b></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{
                      afiliadoConsultado.municipio_atencion
                        ? afiliadoConsultado.municipio_atencion.nombre
                        : "Sin Municipio"
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title><b>IPS principal</b></v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      afiliadoConsultado.ips
                        ? afiliadoConsultado.ips.nombre
                        : "Sin Municipio"
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-card>
        <v-alert
          v-if="verCampos == true"
          dense
          text
          border="left"
          color="blue-grey"
          icon="mdi-account-edit"
        >
          <b>Datos de Caracterización</b>
        </v-alert>
        <v-container v-if="verCampos == true" fluid>
          <v-row dense>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Estrato Socioeconómico"
                type="number"
                v-model="afiliadoConsultado.estrato"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                dense
                label="Nivel Educativo"
                :items="opcionesNivelEducativo"
                v-model="afiliadoConsultado.nivel_educativo"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Ocupación"
                type="text"
                v-model="afiliadoConsultado.ocupacion"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                dense
                label="Estado Civil"
                :items="opcionesEstadoCivil"
                v-model="afiliadoConsultado.estado_civil"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                dense
                label="Discapacidad"
                :items="opcionesDiscapacidad"
                v-model="afiliadoConsultado.discapacidad"
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              sm="4"
              md="4"
              v-if="afiliadoConsultado.discapacidad !== 'Sin discapacidad'"
            >
              <v-autocomplete
                dense
                label="Grado Discapacidad"
                :items="opcionesGradoDiscapacidad"
                v-model="afiliadoConsultado.grado_discapacidad"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                dense
                label="Etnia"
                :items="opcionesEtnia"
                v-model="afiliadoConsultado.etnia"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Nombre del Acompañante"
                v-model="afiliadoConsultado.nombre_acompanante"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Teléfono del Acompañante"
                v-model="afiliadoConsultado.telefono_acompanante"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Nombre del Responsable"
                v-model="afiliadoConsultado.nombre_responsable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Teléfono del Responsable"
                v-model="afiliadoConsultado.telefono_responsable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                dense
                label="Parentesco del Responsable"
                :items="opcionesParentesco"
                v-model="afiliadoConsultado.parentesco_responsable"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>

        <v-alert
          v-if="verCampos == true"
          dense
          text
          border="left"
          color="blue-grey"
          icon="mdi-cellphone-marker"
        >
          <b>Información de contacto</b>
        </v-alert>
        <v-container v-if="verCampos == true" fluid>
          <!-- contacto -->
          <v-row dense>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Teléfono"
                type="number"
                v-model="afiliadoConsultado.telefono"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Número de celular principal"
                type="number"
                v-model="afiliadoConsultado.celular1"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Número de celular alternativo"
                type="number"
                v-model="afiliadoConsultado.celular2"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Correo electrónico principal"
                type="email"
                v-model="afiliadoConsultado.correo1"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="correo electrónico alternativo"
                v-model="afiliadoConsultado.correo2"
              >
              </v-text-field>
            </v-col>
            <!-- ubicación -->
            <v-col cols="12">
              <v-alert
                v-if="verCampos == true"
                dense
                text
                border="left"
                color="blue-grey"
                icon="mdi-map-marker"
              >
                <b>Información de ubicación residencia</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                dense
                :items="direccion_residencia_cargue_items"
                label="(Calle, avenida, Carrera, etc)"
                v-model="afiliadoConsultado.direccion_residencia_cargue"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Número exterior"
                v-model="
                  afiliadoConsultado.direccion_residencia_numero_exterior
                "
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Tipo de vía"
                v-model="afiliadoConsultado.direccion_residencia_via"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Número interior"
                v-model="
                  afiliadoConsultado.direccion_residencia_numero_interior
                "
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                dense
                label="Barrio"
                v-model="afiliadoConsultado.direccion_residencia_barrio"
              >
              </v-text-field>
            </v-col>
            <!-- ubicación atención -->
            <v-col cols="12">
              <v-alert
                v-if="verCampos == true"
                dense
                text
                border="left"
                color="blue-grey"
                icon="mdi-hospital-box-outline"
                ><b>Datos para la ubicación de la atención</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                v-model="departamentoAtencion"
                label="Departamento de atención"
                :items="departamentos"
                item-value="id"
                item-text="nombre"
                dense
                @change="listarMunicipios(departamentoAtencion)"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                v-model="afiliadoConsultado.municipio_atencion_id"
                label="Municipio de atención"
                :items="municipios"
                item-value="id"
                item-text="nombre"
                dense
                @change="listarReps(afiliadoConsultado.municipio_atencion_id)"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                v-model="afiliadoConsultado.ips_id"
                label="Nit o Nombre del Prestador (Institución ha crear)"
                :items="reps"
                item-value="id"
                item-text="nombre"
                dense
              >
              </v-autocomplete>
            </v-col>
            <!-- usuario y contraseña -->
            <v-col cols="12">
              <v-alert
                v-if="verCampos == true"
                dense
                text
                border="left"
                color="blue-grey"
                icon="mdi-hospital-box-outline"
                ><b>Datos para el ingreso a la plataforma</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                dense
                label="Usuario de la Plataforma"
                v-model="afiliadoConsultado.email"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                dense
                label="Cambiar Contraseña"
                v-model="contrasena"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="verCampos == true"
        dark
        small
        color="info"
        @click="descargarCertificado()"
        >Certificado de Afiliación
      </v-btn>
      <v-btn
        v-if="verCampos == true"
        @click="actualizarAfiliado()"
        small
        type="success"
        dark
        color="green"
      >
        Actualizar datos</v-btn
      >
    </v-card-actions>
    <v-col cols="12"></v-col>
    <v-col cols="12"></v-col>
    <v-col cols="12"></v-col>
    <v-col cols="12"></v-col>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "WorkspaceJsonActualizacionPacientes",
  layout: "actualizacion",
  auth: false,

  data() {
    return {
      direccion_residencia_cargue_items: [
        "Calle",
        "Avenida",
        "Carrera",
        "Transversal",
        "Autopista",
        "Vereda",
      ],
      afiliado: "",
      verCampos: false,
      originalDepartamentoAtencion: "",
      originalMunicipioAtencion: "",
      originalIps: "",
      departamentoAtencion: "",
      documentoAfiliado: null,
      afiliadoConsultado: [],
      municipios: [],
      municipio: [],
      departamentos: [],
      reps: [],
      rep: null,
      fechaAfiliado: null,
      filtro: {
        numero_documento: "",
      },
      contrasena: "",
      afiliadoConsultado: {
        telefono: "",
        celular1: "",
        celular2: "",
        correo1: "",
        correo2: "",
        direccion_residencia_cargue: "",
        direccion_residencia_numero_exterior: "",
        direccion_residencia_via: "",
        direccion_residencia_numero_interior: "",
        direccion_residencia_barrio: "",
        departamento_atencion_id: "",
        ips_id: "",
        departamento_atencion_id: "",
        municipio_atencion_id: "",
        estrato: "",
        etnia: "",
        nivel_educativo: "",
        ocupacion: "",
        estado_civil: "",
        discapacidad: "",
        grado_discapacidad: "",
        nombre_acompanante: "",
        telefono_acompanante: "",
        nombre_responsable: "",
        telefono_responsable: "",
        parentesco_responsable: "",
        discapacidad: "",
        grado_discapacidad: "",
      },
      opcionesNivelEducativo: [
        "Analfabeta",
        "Inicial",
        "Preescolar",
        "Primaria",
        "Bachiller",
        "Tecnólogo/Técnico",
        "Universitario",
        "Postgrado (Especialización,maestría,doctorado)",
      ],
      opcionesEstadoCivil: [
        "Soltero",
        "Casado",
        "Unión libre",
        "Viudo",
        "Separado",
        "Divorciado",
      ],
      opcionesDiscapacidad: [
        "Sin discapacidad",
        "Física",
        "Auditiva",
        "Mental/psíquica",
        "Sordo - Ceguera",
        "Visual",
      ],
      opcionesGradoDiscapacidad: ["Leve", "Moderada", "Severa"],
      opcionesEtnia: [
        "Afrocolombiano",
        "Palenquero",
        "Indígena",
        "Afrodescendiente",
        "Raizal",
        "Room",
        "Mulato",
        "Sin pertenencia étnica",
      ],
      opcionesParentesco: [
        "PADRE O MADRE",
        "CONYUGUE O COMPAÑERO",
        "HIJO DOCENTE",
        "HIJO DISCAPACITADO",
        "HIJO CONYUGE",
        "HIJO ADOPTIVO",
        "NIETO MENOR O IGUAL A 30 DÍAS",
        "PRIMO(A)",
        "TÍO(A)",
        "ABUELO(A)",
        "NO APLICA",
      ],
    };
  },
  watch: {
    departamentoAtencion(newVal) {
      this.departamento_atencion_id = "";
      this.municipioId = null;
      this.reps = [];
      this.listarMunicipios(newVal);
    },
  },
  created() {
    this.listarDepartamentos();
  },

  methods: {
    ...mapActions("app", ["setPreload"]),

    //Funcion para actualizar los datos del afiliado, si es beneficiario deja modificar los datos de atencion, si es cotizante no se podran modificar
    actualizarAfiliado() {
      // Validación para ver si los datos de atención cambian
      const ubicacionModificada =
        this.originalDepartamentoAtencion !== this.departamentoAtencion ||
        this.originalMunicipioAtencion !==
          this.afiliadoConsultado.municipio_atencion_id ||
        this.originalIps !== this.afiliadoConsultado.ips_id;

      if (
        this.afiliadoConsultado.telefono == "" ||
        this.afiliadoConsultado.celular1 == "" ||
        this.afiliadoConsultado.correo1 == "" ||
        this.afiliadoConsultado.direccion_residencia_cargue == "" ||
        this.afiliadoConsultado.direccion_residencia_numero_exterior == "" ||
        this.afiliadoConsultado.direccion_residencia_via == "" ||
        this.afiliadoConsultado.direccion_residencia_numero_interior == "" ||
        this.afiliadoConsultado.ips_id == "" ||
        this.afiliadoConsultado.departamento_atencion_id == "" ||
        this.afiliadoConsultado.municipio_atencion_id == ""
      ) {
        return this.$swal({
          title: "¡Falta información!",
          text: "Debes ingresar todos los datos del formulario para poder actualizar tus datos",
          type: "error",
        });
      }

      // Se valida si el afiliado es cotizante y si se modificaron los datos de ubicación de atención
      if (
        this.afiliadoConsultado.tipo_afiliado_id == 2 &&
        ubicacionModificada
      ) {
        return this.$swal({
          title: "Atención",
          text: "No puedes actualizar los datos de atención por ser cotizante",
          type: "error",
        });
      }

      this.setPreload(true);
      let formData = new FormData();
      formData.append("numero_documento", this.documentoAfiliado);
      formData.append("telefono", this.afiliadoConsultado.telefono);
      formData.append("celular1", this.afiliadoConsultado.celular1);
      formData.append("celular2", this.afiliadoConsultado.celular2);
      formData.append("correo1", this.afiliadoConsultado.correo1);
      formData.append("correo2", this.afiliadoConsultado.correo2);
      formData.append(
        "direccion_residencia_barrio",
        this.afiliadoConsultado.direccion_residencia_barrio
      );
      formData.append(
        "direccion_residencia_cargue",
        this.afiliadoConsultado.direccion_residencia_cargue
      );
      formData.append(
        "direccion_residencia_numero_exterior",
        this.afiliadoConsultado.direccion_residencia_numero_exterior
      );
      formData.append(
        "direccion_residencia_via",
        this.afiliadoConsultado.direccion_residencia_via
      );
      formData.append(
        "direccion_residencia_numero_interior",
        this.afiliadoConsultado.direccion_residencia_numero_interior
      );
      formData.append("ips_id", this.afiliadoConsultado.ips_id);
      formData.append("departamento_atencion_id", this.departamentoAtencion);
      formData.append(
        "municipio_atencion_id",
        this.afiliadoConsultado.municipio_atencion_id
      );

      // Se verifica si la contraseña no es nula antes de añadirla al formulario
      if (this.contrasena !== null && this.contrasena !== "") {
        formData.append("contrasena", this.contrasena);
      }

      formData.append("user_id", this.afiliadoConsultado.user_id);

      formData.append("estrato", this.afiliadoConsultado.estrato);
      formData.append(
        "nivel_educativo",
        this.afiliadoConsultado.nivel_educativo
      );
      formData.append("ocupacion", this.afiliadoConsultado.ocupacion);
      formData.append("estado_civil", this.afiliadoConsultado.estado_civil);
      formData.append("discapacidad", this.afiliadoConsultado.discapacidad);

      this.afiliadoConsultado.discapacidad !== "Sin discapacidad"
        ? formData.append(
            "grado_discapacidad",
            this.afiliadoConsultado.grado_discapacidad
          )
        : formData.append("grado_discapacidad", "");
      formData.append("etnia", this.afiliadoConsultado.etnia);
      formData.append(
        "nombre_acompanante",
        this.afiliadoConsultado.nombre_acompanante
      );
      formData.append(
        "telefono_acompanante",
        this.afiliadoConsultado.telefono_acompanante
      );
      formData.append(
        "nombre_responsable",
        this.afiliadoConsultado.nombre_responsable
      );
      formData.append(
        "telefono_responsable",
        this.afiliadoConsultado.telefono_responsable
      );
      formData.append(
        "parentesco_responsable",
        this.afiliadoConsultado.parentesco_responsable
      );

      this.$axios
        .post("auth/actualizacion-pacientes/", formData)
        .then((res) => {
          this.afiliado = res.data;

          this.consultarDatosAfiliado();
          return this.$swal({
            title: "Correcto",
            text: "Se han actualizado los datos correctamente",
            type: "success",
            showConfirmButton: false,
            timer: 2500,
          });
        })
        .catch((error) => {
          this.$toast.error(
            "No se pudo realizar la actualización correctamente"
          );
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    //Funcion para consultar y traer los datos del afiliado
    consultarDatosAfiliado() {
      if (this.documentoAfiliado == null) {
        return this.$swal({
          title: "¡No puede ser!",
          text: "Debe ingresar su número de documento para realizar la búsqueda",
          type: "warning",
        });
      }
      if (this.fechaAfiliado == null) {
        return this.$swal({
          title: "¡No puede ser!",
          text: "Debe ingresar su fecha de nacimiento para realizar la búsqueda",
          type: "warning",
        });
      }
      this.setPreload(true);
      let formData = new FormData();
      formData.append("documento", this.documentoAfiliado);
      formData.append("fecha", this.fechaAfiliado);
      this.$axios
        .post("/auth/pagina", formData)
        .then((res) => {
          this.afiliadoConsultado = res.data;
          this.listarReps(this.afiliadoConsultado.municipio_atencion_id);
          this.verCampos = true;
          //como llegan los valores originales de ubicacion de atencion
          this.originalDepartamentoAtencion =
            this.afiliadoConsultado.departamento_atencion_id;
          this.originalMunicipioAtencion =
            this.afiliadoConsultado.municipio_atencion_id;
          this.originalIps = this.afiliadoConsultado.ips_id;
          // Asignar los valores de departamento, municipio y rep
          this.departamentoAtencion =
            this.afiliadoConsultado.departamento_atencion_id;
          this.municipioAtencion =
            this.afiliadoConsultado.municipio_atencion_id;
          this.ipsAtencion = this.afiliadoConsultado.ips_id;
        })
        .catch((error) => {
          this.$toast.error(
            "No se encontró ningún afiliado con los datos ingresados"
          );
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    //Listar los municipios de acuerdo al departamento elegido
    listarMunicipios(departamentoId) {
      const departamento = this.departamentos.find(
        (dep) => dep.id === departamentoId
      );
      if (departamento) {
        this.municipios = departamento.municipios;
      }
    },

    //listar los reps de acuerdo al municipio que se elija
    listarReps(municipioId) {
      this.setPreload(true);
      this.$axios
        .get(`/auth/reps-municipio/${municipioId}`)
        .then((res) => {
          this.reps = res.data;
          if (this.reps.length === 0) {
            return this.$swal({
              title: "No hay representantes",
              text: "No hay representantes disponibles en el municipio seleccionado. Por favor, acérquese a la IPS pública del municipio.",
              icon: "info",
              confirmButtonText: "Aceptar",
            });
          }
        })
        .catch((error) => {
          swal.fire({
            title: "Error",
            text: "No se pudo listar los representantes.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    listarDepartamentos() {
      this.$axios
        .get("auth/departamentos/")
        .then((res) => {
          this.departamentos = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    limpiar() {
      this.verCampos = false;
      this.documentoAfiliado = null;
      this.fechaAfiliado = null;
      this.afiliadoConsultado = [];
      this.contrasena = null;
    },

    //Descargar el certificado de afiliacion
    descargarCertificado() {
      this.setPreload(true);
      let data = {
        numero_documento: this.afiliadoConsultado.numero_documento,
        tipo_documento: this.afiliadoConsultado.tipo_documento.nombre,
        nombre_completo: this.afiliadoConsultado.nombre_completo,
        estado: this.afiliadoConsultado.estado_afiliado.nombre,
        tipo_afiliado: this.afiliadoConsultado.tipo_afiliado_id,
        ips: this.afiliadoConsultado.ips.nombre,
      };
      this.$axios
        .post("auth/certificado/crear", data)
        .then((res) => {
          this.$toast.success("Certificado generado con exito");
          this.pdf();
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    pdf() {
      const data = {
        tipo: "certificadoAfiliado",
        id: this.afiliadoConsultado.id,
      };
      this.setPreload(true);
      this.$axios
        .post("auth/certificado/pdf", data, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        })
        .catch((e) => {
          this.$toast.error("Ocurrio un error al generar el certificado");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
