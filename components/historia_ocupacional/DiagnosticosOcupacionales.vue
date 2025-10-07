<template>
  <v-container grid-list-md fluid class="pa-0">
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked"> DIAGNOSTICOS
      OCUPACIONALES</v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="12">
        <v-layout row wrap>
          <v-col cols="12" sm="6">
            <v-autocomplete v-model="Cie10_id" append-icon="mdi-magnify" :items="cieConcat"
              item-disabled="customDisabled" item-text="nombre" item-value="id" label="Diagnóstico">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" class="pt-0">
            <v-select :items="['Impresión diagnóstica', 'Confirmado nuevo','Confirmado repetido']"
              label="Tipo Diagnóstico" v-model="Tipodiagnostico" chips></v-select>
          </v-col>
          <v-col cols="12" sm="12">
            <v-autocomplete v-if="Tipodiagnostico != 'Impresión diagnóstica' && Tipodiagnostico" :items="['Oncológicos','Anticoagulados','Salud Mental','Nefroprotección ','Respiratorios',
                                    'Reumatologicos','Tramisibles Crónicas','Gestantes','Enfermedades Huerfanas','Trasplantados',
                                    'Polimedicados','Pacientes Tutela','Paciente Alto Costo','Domiciliario','Primera Infancia','Infancia ',
                                    'Adolescencia ','Juventud ','Riesgo Cardiovascular','Grupal Curso Psicoprofilactico',
                                    'Apoyo Lactancia Materna ','Detección Temprana Cáncer Cuello Uterino ','Riesgo Cardiovascular',
                                    'Planificación Familiar','Atención Preconcepcional','Promocion De Alimentacion Y Nutricion','Prenatal',
                                    'Atención Del Posparto','Atención Del Recien Nacido','Detección Temprana Cancer De Mama', 'Adultez', 'Vejez'
						            ]" label="Marcar paciente" v-model="Marcapaciente" attach multiple chips></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="info" dark small>Registrar diagnostico</v-btn>
            </v-card-actions>
          </v-col>
          <v-col cols="12" sm="12">
            <v-data-table :headers="headersDiagnostico" :items="Diagnostico" :search="search">
              <template v-slot:items="props">
                <tr :active="props.selected" @click="props.selected = !props.selected">
                  <td>
                    <v-checkbox color="primary" v-model="selectedItems" hide-details :value="props.item">
                    </v-checkbox>
                  </td>
                  <td>{{ props.item.Codigo }}</td>
                  <td class="text-xs-center">{{ props.item.Tipodiagnostico }}</td>
                  <td class="text-xs-center">
                    <v-select :items="props.item.Marcapaciente" label="Marcar paciente"
                      v-model="props.item.Marcapaciente" attach multiple chips></v-select>
                  </td>
                  <td class="text-xs-center">
                    <v-btn fab utline color="error" small @click="removeDiagnostico(props)">
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="12" sm="12">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" dark small>Guardar</v-btn>
            </v-card-actions>
          </v-col>
        </v-layout>
      </v-col>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    name: "",
    props: {
      datosCita: Object
    },
    created() {
      // this.fetchCie10s();
      // this.fetchDiagnostico();
    },
    data() {
      return {
        Cie10_id: '',
        cie10Array: [],
        cie10s: [],
        Tipodiagnostico: '',
        headersDiagnostico: [{
            text: "Marcar Principal",
            align: "center",
            value: "marcar"
          },
          {
            text: "Diagnóstico",
            align: "center",
            value: "diagnostico"
          },
          {
            text: "Tipo Diagnóstico",
            align: "center",
            value: "tipo_diagnostico"
          },
          {
            text: "Marca",
            align: "center",
            value: "marca"
          },
          {
            text: "",
            align: "center",
            value: ""
          }
        ],
        Diagnostico: [],
        search: '',
        Marcapaciente: [],
        selectedItems: {},
        DiagnosticoSaved: [],
      }
    },

    computed: {
      cieConcat() {
        if (this.cie10s !== undefined) {
          return this.cie10Array = this.cie10s.map(cie => {
            return {
              id: cie.id,
              codigo: cie.Codigo_CIE10,
              nombre: `${cie.Codigo_CIE10} - ${cie.Descripcion}`,
              customDisabled: false
            };
          });
        }
      }
    },

    methods: {

      // fetchCie10s() {
      //     axios.get("/api/cie10/all").then(res => {
      //         this.cie10s = res.data;
      //     });
      // },

      // addDiagnostico() {
      //     if (this.Cie10_id) {
      //         this.cie10Array.find(cie10 => {
      //             if (cie10.id == this.Cie10_id) {
      //                 this.Codigo = cie10.codigo;
      //             }
      //         });
      //     }
      //     if (
      //         this.Cie10_id &&
      //         this.Tipodiagnostico != "Impresión diagnóstica" &&
      //         this.Marcapaciente.length > 0
      //     ) {
      //         this.Diagnostico.push({
      //             Cie10_id: this.Cie10_id,
      //             Tipodiagnostico: this.Tipodiagnostico,
      //             Marcapaciente: this.Marcapaciente,
      //             Esprimario: false,
      //             Codigo: this.Codigo
      //         });
      //         this.disable(this.Cie10_id);
      //         this.clearDataArticulo();
      //     } else if (
      //         this.Cie10_id &&
      //         this.Tipodiagnostico == "Impresión diagnóstica" &&
      //         this.Marcapaciente.length == 0
      //     ) {
      //         this.Diagnostico.push({
      //             Cie10_id: this.Cie10_id,
      //             Tipodiagnostico: this.Tipodiagnostico,
      //             Esprimario: false,
      //             Codigo: this.Codigo
      //         });
      //         this.disable(this.Cie10_id);
      //         this.clearDataArticulo();
      //     }
      // },

      // removeDiagnostico(diagnostico) {
      //     this.Diagnostico.splice(diagnostico.index, 1);
      //     if (diagnostico.item.id != null) {
      //         axios
      //             .get(`/api/cie10/deleteDiagnostic/${diagnostico.item.id}`)
      //             .then(res => localStorage.removeItem("Diagnostico"));
      //     }
      //     this.cie10Array.map(cie10 => {
      //         if (cie10.id == diagnostico.item.Cie10_id) {
      //             cie10.customDisabled = false
      //         }
      //     });
      // },

      // fetchDiagnostico() {
      //     axios.get(`/api/cie10/diagnostico/${this.datosCita.cita_paciente_id}`).then(res => {
      //         console.log(res.data.cie10)
      //         this.DiagnosticoSaved = res.data.cie10;
      //         this.Diagnostico = this.DiagnosticoSaved;
      //     });
      // },

      // clearDataArticulo() {
      //     this.Cie10_id = '';
      //     this.Tipodiagnostico = '';
      //     this.Marcapaciente = '';
      //     this.Codigo = '';
      // },

      // disable(id) {
      //     this.cie10Array.map(cie10 => {
      //         if (cie10.id == id) {
      //             cie10.customDisabled = true
      //         }
      //     });
      // },

      // submitDiagnostico() {
      //     if (this.Diagnostico.length == 0 || !this.selectedItems) {
      //         swal({
      //             title: "Debe asignar un diagnostico principal",
      //             icon: "warning"
      //         });
      //         return;
      //     }
      //     var diag = [];
      //     this.Diagnostico.forEach(diagnostico => {
      //         if (diagnostico.Cie10_id == this.selectedItems.Cie10_id) {
      //             diagnostico.Esprimario = true;
      //         }
      //         if (diagnostico.id == null) {
      //             diag.push(diagnostico);
      //         }
      //     });
      //     swal({
      //         title: "¿Está Seguro(a)?",
      //         text: "El diagnóstico será almacenado",
      //         icon: "warning",
      //         buttons: ["Cancelar", "Confirmar"],
      //         dangerMode: true
      //     }).then(willDelete => {
      //         if (willDelete) {
      //             axios
      //                 .post(`/api/cie10/create/${this.datosCita.cita_paciente_id}`, diag)
      //                 .then(res => {
      //                     this.$alertHistoria('<span style="color:#fff">' + res.data.message +
      //                         '<span>');
      //                     this.$emit('respuestaComponente')

      //                 })

      //         }
      //     });
      // },

    }
  }

</script>
