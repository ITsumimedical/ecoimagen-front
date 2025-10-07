<template>
  <v-container fluid>
    <form>
      <v-card-text>
        <v-row>
          <v-col cols="3" sm="3" md="2">
            <v-text-field v-model="itemsAfiliado.tipo_documento" label="Tipo documento" readonly>
            </v-text-field>
          </v-col>
          <v-col cols="3" sm="3" md="2">
            <v-text-field v-model="itemsAfiliado.numero_documento" label="Numero documento" readonly>
            </v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="8">
            <v-text-field v-model="itemsAfiliado.primer_nombre" label="Nombre" readonly>
            </v-text-field>
          </v-col>
          <v-col cols="4" sm="4" md="4">
            <v-text-field v-model="tutelas.direccion" label="Direccion" :error-messages="errors.direccion">
            </v-text-field>
          </v-col>
          <v-col cols="4" sm="4" md="4">
            <v-text-field v-model="tutelas.telefono" label="Telefono" type="number" :error-messages="errors.telefono">
            </v-text-field>
          </v-col>
          <v-col cols="4" sm="4" md="4">
            <v-text-field v-model="tutelas.telefono" label="Correo" type="email" :error-messages="errors.telefono">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-textarea v-model="tutelas.observacion" label="Obeservacion" outlined
              :error-messages="errors.observacion">
            </v-textarea>
          </v-col>
        </v-row>

        <!-- Boton de acciones de guardar y cancelar -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogoGestion = false,limpiardata()">
            Cancelar
          </v-btn>
          <v-btn color="boton" dark @click="guardarTutela()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </form>
  </v-container>
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

    data: () => ({
      paginate: {
        total: 0,
        page: 1
      },
      loading: false,
      afiliados: [],
      municipios: [],
      afiliado: [],
      juzgados: [],
      allCups: [],
      Cups: [],
      medicamentos: [],
      allMedicamentos: [],
      medicinalaboralotro: null,
      reembolsotro: null,
      transporteotro: null,
      otro_tiposervicio: [],
      requerimientos: [],
      exclusiones: ['SI', 'NO'],
      continuidades: ['NUEVO', 'CONTINUIDAD'],
      tipoDocumento: [],
      responsables: [],
      exclusion: ['TRATAMIENTO INFERTILIDAD', 'TRATAMIENTO ESTETICO', 'TRATAMIENTO EXPERIMENTAL',
        'TRATAMIENTO MEDICO-QUIRURGICO REALIZADO EN EL EXTERIOR',
        'MEDICAMENTO NO AUTORIZADO POR INVIMA', 'TECNOLOGIA SIN EVIDENCIA CIENTIFICA', 'ORTODONCIA',
        'IMPLANTOLOGIA DENTAL',
        'DISPOSITIVO PROTESICO CAVIDAD ORAL', 'BLANQUEAMIENTO DENTAL',
        'INSTITUCIONES NO HABILITADAS EN SISTEMA DE SALUD',
        'ARTICULO SUNTUARIO', 'COSMETICOS', 'VITAMINAS', 'LIQUIDOS PARA LENTES DE CONTACTO',
        'TRATAMIENTO CAPILAR', 'SHAMPOO',
        'JABON', 'ENJUAGUE BUCAL', 'CREMA DENTAL', 'CEPILLO', 'SEDA DENTAL', 'ELEMENTOS DE ASEO', 'LECHES',
        'CREMA HIDRATANTE',
        'ANTISOLAR', 'DROGAS PARA LA MEMORIA', 'EDULCORANTES O SUSTITUTOS DE LA SAL', 'ANOREXIGENOS',
        'SERVICIOS FUERA DEL AMBITO DE SALUD',
        'CALZADO ORTOPEDICO', 'PAÑALES', 'TOALLAS HIGIENICAS'
      ],
      gestionDocumental: ['DERECHO DE PETICION NO CONTESTADO', 'SOLICITUD HISTORIA CLINICA'],
      tipoServicios: [],
      TipoAfiliado: [],
      tipo_servicio: [],
      medicinalaboral: [],
      reembolso: [],
      transporte: [],
      buscar: '',
      buscarAfiliado: null,
      dialogo: false,
      dialogoGestion: false,
      itemsAfiliado: {
        ut: null,
        tipo_documento: null,
        numero_documento: null,
        primer_nombre: null,
        primer_apellido: null,
      },
      novedadesregistro: null,
      gestiondocumental: null,
      tutelas: {
        direccion: '',
        telefono: '',
        radicado: '',
        exclusion: '',
        integralidad: '',
        continuidad: '',
        novedad_registro: '',
        municipio_id: '',
        juzgado_id: '',
        tipo_requerimientos_id: '',
        fecha_radica: '',
        observacion: '',
        fecha_realiza: ''
      },
      errors: {
        direccion: null,
        telefono: null,
        continuidad: null,
        direccion: null,
        exclusion: null,
        fecha_radica: '',
        integralidad: null,
        juzgado_id: null,
        municipio_id: null,
        observacion: null,
        radicado: null,
        telefono: null,
        tipo_requerimientos_id: null
      },
      headers: [{
          text: 'id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        {
          text: 'Nombre',
          align: 'rigth',
          value: 'primer_nombre'
        },
        {
          text: 'Apellido',
          align: 'rigth',
          value: 'primer_apellido'
        },
        {
          text: 'Documento',
          align: 'rigth',
          value: 'numero_documento'
        },
        {
          text: 'Tipo afiliado',
          align: 'rigth',
          value: 'tipo_afiliado.nombre'
        },
        {
          text: 'Acciones',
          align: 'rigth',
          value: 'actions',
          sortable: false
        },
      ],
    }),

    created() {
      this.listarAfiliado();
      this.listarMunicipio();
      this.listarjuzgados();
      this.listarRequerimietos();
      this.listarResponsables();
    },

    computed: {
      itemsTipoServicio() {
        let items = ['NOVEDADES Y REGISTRO', 'EXCLUSION', 'GESTION DOCUMENTAL', 'HOSPITALIZACION', 'SERVICIOS',
          'MEDICAMENTOS',
          'MEDICINA LABORAL', 'REEMBOLSO', 'REINTEGRO LABORAL', 'TRANSPORTE', 'OTROS'
        ];

        if (this.tipo_servicio == []) return items

        if (this.ActivarCampos('OTROS')) {
          this.tipo_servicio = ['OTROS']
        }
        return items
      },
    },

    methods: {
      listarAfiliado() {
        this.loading = true
        this.$axios.get('/afiliado/listar').then(res => {
          this.afiliados = res.data.data
          this.paginate.total = res.data.last_page
          this.paginate.page = res.data.current_page
          this.loading = false
        }).catch(error => {
          this.$toast.error(error.response.data.error)
          this.loading = false
        })
      },

      guardarTutela() {
        if (this.tutelas.responsable == null) {
          return this.$toast.error('Debe indicar un responsable')
        }
        this.$axios.post('/tutela/', this.tutelas).then(res => {
          this.$toast.success(res.data.mensaje)
          this.limpiarError()
          this.dialogoGestion = false
        }).catch(error => {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        })
      },

      cerrar() {
        this.dialogo = false
        this.limpiardata()
      },

      marcarPaciente() {
        this.dialogo = true
      },

      limpiardata() {
        for (const key in this.itemsAfiliado) {
          this.itemsAfiliado[key] = ''
        }
        this.buscarAfiliado = null
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

      gestionTutela(item) {
        this.dialogoGestion = true
        this.itemsAfiliado = item
        this.tutelas.afiliado_id = item.id

      },

      actualizarAfiliado(id) {
        this.$axios.put('/afiliado/' + id, this.editarusuario).then(res => {
          this.$toast.success(res.data.mensaje)
          this.dialogoEditar = false
        }).catch(error => {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        })
      },

      listarMunicipio() {
        this.$axios.get('/municipios/listar').then(res => {
          this.municipios = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      listarjuzgados() {
        this.$axios.post('juzgado/listar').then(res => {
          this.juzgados = res.data
        }).catch(error => {
          console.log(error)
        })
      },


      listarRequerimietos() {
        this.$axios.get('tipo-requerimiento').then(res => {
          this.requerimientos = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      listarResponsables() {
        this.$axios.get('responsable').then(res => {
          this.responsables = res.data.data
        }).catch(error => {
          console.log(error)
        })
      },

      listartipoServicio() {
        this.$axios.get('tipo-servicio').then(res => {
          this.tipoServicios = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      /**
       * buscar afiliado
       * @param cedula string
       * @return objeto usuario
       * @author kobatime
       */
      buscar_afiliado(cedula) {
        if (this.buscarAfiliado == null || this.itemsAfiliado.Primer_Nom == "") {
          this.$swal({
            type: "warning",
            title: "¡Ingrese un número de documento!",
            buttons: false
          });
        }
        this.loading = true
        this.$axios.get('/afiliado/' + cedula).then(res => {
          this.itemsAfiliado = res.data
          this.loading = false
        }).catch(error => {
          if (error.response.data.error) {
            this.$toast.error(error.response.data.error)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        })
      },

      /**
       * Marcar Paciente
       * @param itemsAfiliado objeto
       * @return objeto afiliado
       * @author kobatime
       */
      marcarAfiliado() {
        const msg = "Esta seguro de marcar el paciente " + this.itemsAfiliado.nombre_completo +
          " con numero de documento " + this.itemsAfiliado.numero_documento;
        this.$swal({
          title: msg,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        }).then(async resultado => {
          if (resultado.value) {
            this.itemsAfiliado.tutela = true
            await this.$axios.post('afiliado/crearMarcacion/' + this.itemsAfiliado.id, this.itemsAfiliado).then(
              res => {
                this.listarAfiliado();
                this.$swal({
                  title: "¡Afiliado marcado con exito!",
                  timer: 2000,
                  type: "success",
                });
                this.cerrar();
              }).catch(error => {
              this.$toast.error(error.response.data.mensaje)
            })
          }
        });
      },

      ActivarCampos(msg) {
        let found = this.tipo_servicio.find(tipo => tipo == msg);
        if (found) return true;
        return false;
      },

      OtroMedicinalaboral(msg) {
        return this.medicinalaboral == msg || false;
      },

      OtroReembolso(msg) {
        return this.reembolso == msg || false;
      },

      OtroTransporte(msg) {
        return this.transporte == msg || false;
      },

      remover(item) {
        this.otro_tiposervicio.splice(this.otro_tiposervicio.indexOf(item), 1)
        this.otro_tiposervicio = [...this.otro_tiposervicio]
      },
      remove_responsable(item) {
        this.responsable.splice(this.responsable.indexOf(item), 1)
        this.responsable = [...this.responsable]
      },
      remover_servicio(item) {
        const index = this.tipo_servicio.indexOf(item)
        if (index >= 0) this.tipo_servicio.splice(index, 1)
      },
      remover_exclusiones(item) {
        const index = this.exclusiones.indexOf(item)
        if (index >= 0) this.exclusiones.splice(index, 1)
      },
      remover_cups(item) {
        const index = this.allCups.indexOf(item)
        if (index >= 0) this.allCups.splice(index, 1)
      },
      remover_medicamentos(item) {
        const index = this.allMedicamentos.indexOf(item)
        if (index >= 0) this.allMedicamentos.splice(index, 1)
      },

    }
  }

</script>
