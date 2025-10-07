<template>
  <div>
    <v-card elevation="0">
      <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
        <b>Datos de caracterización basica</b></v-alert>
      <v-card-text>
        <!-- <pre>{{datos}}</pre> -->
        <v-row dense>
          <v-col cols="3" md="3" sm="3">
            <v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
              no-data-text="No hay resultados" item-value="id" item-text="nombre"
              v-model="datosFormulario.tipo_documento" />
          </v-col>
          <v-col cols="3" md="3" sm="3">
            <v-text-field dense outlined label="Número Documento" v-model.trim="datosFormulario.numero_documento" />
          </v-col>
          <v-col cols="3" md="3" sm="3">
            <v-text-field dense outlined label="Primer nombre" v-model.trim="datosFormulario.primer_nombre" />
          </v-col>
          <v-col cols="3" md="3" sm="3">
            <v-text-field dense outlined label="Segundo nombre" v-model.trim="datosFormulario.segundo_nombre" />
          </v-col>
          <v-col cols="3" md="3" sm="3">
            <v-text-field dense outlined label="Primer apellido" v-model.trim="datosFormulario.primer_apellido" />
          </v-col>
          <v-col cols="3" md="3" sm="3">
            <v-text-field dense outlined label="Segundo apellido" v-model.trim="datosFormulario.segundo_apellido" />
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-autocomplete dense outlined :items="entidades" item-text="nombre" item-value="id"
              v-model="datosFormulario.entidad_id" label="Entidad">
            </v-autocomplete>
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-autocomplete dense outlined :items="sexo" item-text="nombre" item-value="codigo"
              v-model="datosFormulario.sexo" label="Sexo"></v-autocomplete>
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-text-field dense outlined label="Fecha nacimiento" type="date"
              v-model.trim="datosFormulario.fecha_nacimiento" />
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-text-field dense outlined label="Fecha afiliación" type="date"
              v-model.trim="datosFormulario.fecha_afiliacion" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined v-model="datosFormulario.tipo_afiliacion_id" :items="afiliacion"
              item-text="nombre" item-value="id" label="Tipo afiliación">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined v-model="datosFormulario.tipo_afiliado_id" :items="tipoAfiliado"
              item-text="nombre" item-value="id" label="Tipo afiliado">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined v-model="datosFormulario.estado_afiliacion_id" item-value="id"
              item-text="nombre" label="Estado" :items=estadoAfiliacion>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined v-model="datosFormulario.grupo_sanguineo" label="Grupo sanguineo"
              :items=grupoSanguineo>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined v-model="datosFormulario.nivel_educativo" label="Nivel academico"
              :items=opcionesNivelEducativo>
            </v-autocomplete>
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-text-field dense outlined label="Ocupación" v-model.trim="datosFormulario.ocupacion" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined v-model="datosFormulario.estado_civil" label="Estado civil"
              :items=estadoCivil>
            </v-autocomplete>
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-text-field dense outlined label="Orientación sexual" v-model.trim="datosFormulario.orientacion_sexual" />
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-text-field dense outlined label="Identidad genero" v-model.trim="datosFormulario.identidad_genero" />
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-text-field dense outlined label="Discapacidad" v-model.trim="datosFormulario.discapacidad" />
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-text-field dense outlined label="Rango salarial"
              v-model.trim="datosFormulario.salario_minimo_afiliado" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense :items="pais" outlined item-text="nombre" item-value="id"
              v-model="datosFormulario.pais_id" label="Nacionalidad">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined :items="departamento" item-text="nombre" item-value="id"
              v-model="datosFormulario.departamento_afiliacion_id" @change="
                        listarMunicipiosAfiliacion(datosFormulario.departamento_afiliacion_id)"
              label="Departamento afiliación">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined :items="municipioAfiliacion" item-text="nombre" item-value="id"
              v-model="datosFormulario.municipio_afiliacion_id" label="Municipio afiliación">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined :items="departamento" item-text="nombre" item-value="id"
              v-model="datosFormulario.departamento_atencion_id" @change="
                        listarMunicipiosAtencion(datosFormulario.departamento_atencion_id)"
              label="Departamento atención">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined :items="municipioAtencion" item-text="nombre" item-value="id"
              v-model="datosFormulario.municipio_atencion_id" @change="getReps(datosFormulario.municipio_atencion_id)"
              label="Municipio atencion">
            </v-autocomplete>
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-text-field dense outlined label="Region" v-model.trim="datosFormulario.region" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined v-model="datosFormulario.ips_id" :items="reps" item-text="nombre"
              item-value="id" label="Ips Primaria">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense outlined label="Telefono" v-model.trim="datosFormulario.telefono" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense outlined label="Correo" v-model.trim="datosFormulario.correo1" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense outlined label="Dirección" v-model.trim="datosFormulario.direccion_residencia_cargue" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined :items="departamento" item-text="nombre" item-value="id"
              v-model="datosFormulario.dpto_residencia_id" @change="
                        listarMunicipiosResidencia(datosFormulario.dpto_residencia_id)"
              label="Departamento residencia">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete dense outlined :items="municipioResidencia" item-text="nombre" item-value="id"
              v-model="datosFormulario.mpio_residencia_id" label="Municipio residencia">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense outlined label="Barrio" v-model.trim="datosFormulario.direccion_residencia_barrio" />
          </v-col>
           <v-col cols="12" sm="6" md="3">
            <v-text-field dense outlined label="Nombre responsable" v-model.trim="datosFormulario.nombre_responsable" />
          </v-col>
           <v-col cols="12" sm="6" md="3">
            <v-text-field dense outlined label="Tel responsable" v-model.trim="datosFormulario.telefono_responsable" />
          </v-col>
           <v-col cols="12" sm="6" md="3">
            <v-text-field dense outlined label="Parentesco" v-model.trim="datosFormulario.parentesco_responsable" />
          </v-col>
          <v-col cols="6" md="6" sm="6" >
                <v-btn color="success" small dark @click="crearAfiliado()">Guardar afiliado
                </v-btn>
              </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogoContinuar" persistent width="550">
        <v-card>
        <v-alert dense border="left" text color="primary" icon="mdi-format-list-checkbox">
          <b>Usuario</b>
        </v-alert>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cancelar()" small >Cerrar</v-btn>
          <v-btn color="success" @click="ingresoTriage()" small>Ingreso Triage</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('panelmedico.atenciones')) {
        return redirect('/');
      }
    },
    name: 'admisionPaciente',
    props: {
      nn: Boolean,
      datos: Object,
      ejecutar: Boolean
    },

    data: () => ({
      preload: false,
      dialogoContinuar:false,
      datosFormulario: {},
      tiposDocumentos: [],
      entidades: [],
      afiliacion: [],
      tipoAfiliado: [],
      departamento: [],
      pais: [],
      reps: [],
      municipioAfiliacion: [],
      municipioAtencion: [],
      municipioResidencia: [],
      sexo: [{
          'nombre': 'Masculino',
          'codigo': 'M'
        },
        {
          'nombre': 'Femenino',
          'codigo': 'F'
        }
      ],
      estadoAfiliacion: [{
          'id': 1,
          'nombre': 'Activo'
        },
        {
          'id': 31,
          'nombre': 'Retirado'
        },
        {
          'id': 32,
          'nombre': 'Protección Laboral Cotizante'
        },
        {
          'id': 33,
          'nombre': 'Protección Laboral Beneficiario'
        },
      ],
      grupoSanguineo: ['A+', 'A-', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+'],
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
      estadoCivil: [
        'Soltero',
        'Casado',
        'Viudo',
        'Unión libre'
      ]
    }),

    watch: {
      ejecutar: {
        handler(valor) {
          if (valor) {
            this.listarTiposDocumentos()
            this.datosFormulario.tipo_documento = this.datos.tipo_documento
            this.datosFormulario.numero_documento = this.datos.numero_documento
            if(this.datos.tipo_documento == 15){
              this.datosNn()
            }
            this.listarEntidades()
            this.listarTipoAfiliaciones()
            this.listarTipoAfiliado()
            this.listarPaies()
            this.listarDepartamentos()
            // if(this.datos){

            // }
          }
        },
        immediate: true

      }
    },

    mounted() {},
    methods: {
      listarTiposDocumentos() {

        this.$axios.get("/tipo-documento/listar")
          .then((res) => {
            this.tiposDocumentos = res.data;
          })
          .catch((error) => {
            this.$toast.error(
              "Ocurrió un error al cargar los tipos de documento"
            );
            console.log(error);
          })
          .finally(() => {
            // this.loading = false;
          });
      },

      listarEntidades() {
        this.$axios.get("/entidad/listar").then((res) => {
          this.entidades = res.data;
        }).catch((error) => {
          console.log(error);
        });
      },

      listarTipoAfiliaciones() {
        this.$axios.get("tipo-afiliacion").then((res) => {
          this.afiliacion = res.data.data;
        });
      },

      listarTipoAfiliado() {
        this.$axios.get("tipo-afiliados/listar").then((res) => {
          this.tipoAfiliado = res.data.data;
        });
      },

      listarPaies() {
        this.$axios.post("/pais/listar").then((res) => {
          this.pais = res.data;
        }).catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        });
      },

      listarDepartamentos() {
        this.$axios.get("/departamento/").then((res) => {
          this.departamento = res.data;
        }).catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        });
      },

      listarMunicipiosAfiliacion(data) {
        return this.departamento
          .filter((item) => item.id == data)
          .map((municipios) => {
            return (this.municipioAfiliacion = municipios.municipios);
          });
      },

      listarMunicipiosAtencion(data) {
        return this.departamento
          .filter((item) => item.id == data)
          .map((municipios) => {
            return (this.municipioAtencion = municipios.municipios);
          });
      },

      listarMunicipiosResidencia(data) {
        return this.departamento
          .filter((item) => item.id == data)
          .map((municipios) => {
            return (this.municipioResidencia = municipios.municipios);
          });
      },

      getReps(id) {
        const requets = {
          municipio_id: id,
        };
        // this.preload = true
        this.$axios.post("/reps/listar", requets).then((res) => {
            this.reps = res.data;
            // this.preload = false
          })
          .catch((error) => {
            // this.preload = false
            this.$toast.error("No se ha podido cargar los datos");
          });
      },

      crearAfiliado(){
        this.$axios.post("/afiliados/guardarAfiliadoAdmision", this.datosFormulario).then((res) => {
            // this.reps = res.data;
            // this.preload = false
            this.dialogoContinuar =true
          })
          .catch((error) => {
            // this.preload = false
            this.$toast.error("No se ha podido cargar los datos");
          });
      },

      cancelar(){
        this.dialogoContinuar = false
        this.$emit("limpiar");
      },

      ingresoTriage(){
         this.dialogoContinuar = false
        this.$emit("triage");
      },

      datosNn(){
        this.datosFormulario.primer_nombre = 'NN'
        this.datosFormulario.segundo_nombre = ''
        this.datosFormulario.primer_apellido = 'NN'
        this.datosFormulario.segundo_apellido = ''
        this.datosFormulario.entidad_id = ''
        this.datosFormulario.sexo = ''
        this.datosFormulario.fecha_nacimiento = ''
        this.datosFormulario.fecha_afiliacion = ''
        this.datosFormulario.tipo_afiliacion_id = ''
        this.datosFormulario.tipo_afiliado_id = ''
        this.datosFormulario.estado_afiliacion_id = ''
        this.datosFormulario.grupo_sanguineo = ''
        this.datosFormulario.nivel_educativo = ''
        this.datosFormulario.ocupacion = ''
        this.datosFormulario.estado_civil = ''
        this.datosFormulario.orientacion_sexual = ''
        this.datosFormulario.identidad_genero = ''
        this.datosFormulario.discapacidad = ''
        this.datosFormulario.salario_minimo_afiliado = ''
        this.datosFormulario.pais_id = ''
        this.datosFormulario.departamento_afiliacion_id = ''
        this.datosFormulario.municipio_afiliacion_id = ''
        this.datosFormulario.departamento_atencion_id = ''
        this.datosFormulario.municipio_atencion_id = ''
        this.datosFormulario.region = ''
        this.datosFormulario.ips_id = ''
        this.datosFormulario.telefono = ''
        this.datosFormulario.correo1 = ''
        this.direccion_residencia_cargue = ''
        this.datosFormulario.dpto_residencia_id = ''
        this.datosFormulario.mpio_residencia_id = ''
        this.datosFormulario.direccion_residencia_barrio = ''
        this.datosFormulario.nombre_responsable = ''
        this.datosFormulario.telefono_responsable = ''
        this.datosFormulario.parentesco_responsable = ''
      }

    },
  };

</script>
