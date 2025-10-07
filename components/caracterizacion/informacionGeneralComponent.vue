<template>
	<v-container>
		<v-card outlined elevation="2" class="pa-10">
			<v-card-title class="headline">1. INFORMACIÓN GENERAL</v-card-title>
			<v-divider></v-divider>
			<v-form ref="form" @submit.prevent="guardarDatos">
                <v-row>
                    <v-col cols="12">
                        <br>
						<v-alert text dense border="left" type="info" :icon="false" class="text-center">
							<b>1.1. Datos generales del escenario del entorno que se caracteriza.</b>
						</v-alert>
					</v-col>
                </v-row>
				<v-row>
                    <v-col cols="12" md="3">
                        <v-card-subtitle><strong>
                            1. Número de la familia:</strong>
                        </v-card-subtitle>
                        <v-text-field dense outlined label="Especifique" tipe="number" v-model="form.numeroFamilia"
                            :rules="[rules.obligatorio, rules.numero, rules.nFamilia]" />
                        <v-card-subtitle >
							2. Departamento
						</v-card-subtitle>
							<v-autocomplete dense outlined
                            :items="departamentoItems" item-text="nombre"
                            item-value="id"
                            v-model="form.departamento"
                            @change="listarMunicipiosResidencia(form.departamento)"
                            label="Departamento residencia"
                            :rules="[rules.obligatorio]">
                            </v-autocomplete>
                        <v-card-subtitle >
						    3. Región, provincia:
						</v-card-subtitle>
                        <v-autocomplete dense outlined :items="municipioItems" item-text="nombre" item-value="id"
                            v-model="form.municipioResidencia" label="Municipio residencia"
                            :rules="[rules.obligatorio]">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="5">
                        <v-card-subtitle>
                            Barrio o vereda:
                        </v-card-subtitle>
                        <v-text-field dense outlined label="Especifique" v-model="form.barrioEncuestado"
                            :rules="[rules.obligatorio]" />
                        <v-card-subtitle>
                            Dirección:
                        </v-card-subtitle>
                        <v-text-field dense outlined label="Especifique" v-model="form.direccionEncuestado"
                            :rules="[rules.obligatorio]" />
                        <v-card-subtitle>
                            Estrato:
                        </v-card-subtitle>
                        <v-text-field dense outlined label="Especifique" v-model="form.estratoVivienda"
                          type="number"  :rules="[rules.numero, rules.estratoVivienda, rules.mayorQueCero]" />
                    </v-col>
                    <v-col cols="12" md="4">
						<v-card-subtitle>
							12. Número de hogares en la vivienda.
						</v-card-subtitle>
						<v-text-field dense outlined type="number" label="Escribe acá..."
							v-model="form.numeroHogaresResiden"
							:rules="[rules.obligatorio, rules.numero, rules.mayorQueCero]" />
						<v-card-subtitle>
							13. Número de familias en la vivienda.
						</v-card-subtitle>
						<v-text-field dense outlined type="number" label="Escribe acá..."
							v-model="form.numeroFamiliasQueResiden"
							:rules="[rules.obligatorio, rules.numero, rules.mayorQueCero]" />
						<v-card-subtitle>
							14. Número de personas en la vivienda.
						</v-card-subtitle>
						<v-text-field dense outlined type="number" label="Escribe acá..."
							v-model="form.numeroPersonasResiden"
							:rules="[rules.obligatorio, rules.numero, rules.mayorQueCero]" />
					</v-col>
				</v-row>
                <v-row>
                    <v-col cols="12">
                        <br>
						<v-alert text dense border="left" type="info" :icon="false" class="text-center">
							<b>1.2. Identificación del encuestador</b>
						</v-alert>
					</v-col>
                    <v-col cols="12" md="4">
                        <v-card-subtitle>
                            15. Número de identificación del Equipo Básico de Salud (EBS):
                        </v-card-subtitle>
                        <v-text-field dense outlined label="Especifique" v-model="form.numeroEbs"
                          type="number"  :rules="[rules.obligatorio, rules.ebs]" />
                          <br>
                        <v-card-subtitle>
                            16. Prestador primario / Organismo de adscripción del EBS:
                        </v-card-subtitle>
                        <v-text-field dense outlined v-model="form.prestadorPrimario" disabled/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card-subtitle>
                            19. Código de la ficha de caracterización:
                        </v-card-subtitle>
                        <v-text-field dense outlined v-model="form.codigoFicha" disabled/>
                        <br>
                        <v-card-subtitle>
                            17. responsable de la evaluación de necesidades en salud - caracterización:
                        </v-card-subtitle>
                        <v-text-field dense outlined  v-model="form.nombreEncuestador"
                          disabled />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card-subtitle>
                            20. Fecha diligenciamiento de la ficha:
                        </v-card-subtitle>
                        <v-text-field dense outlined v-model="form.fechaDiligenciamiento" disabled/>
                        <v-card-subtitle>
                            18. Perfil del quien realiza la evaluación de necesidades en salud - caracterización:
                        </v-card-subtitle>
                        <v-text-field dense outlined v-model="form.cargoEncuestador" disabled/>
                    </v-col>
                </v-row>

				<v-row>
					<v-col cols="12" class="d-flex justify-end">
						<v-btn color="success" dark dense @click="guardar">Guardar y Continuar <v-icon right>
								mdi-content-save</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</v-card>
	</v-container>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
                form: {
                    departamento: [],
                    municipioResidencia: [],
					direccionEncuestado: '',
					barrioEncuestado: '',
                    numeroFamilia: '',
                    estratoVivienda: '',
                    numeroHogaresResiden: '',
                    numeroFamiliasQueResiden: '',
                    numeroPersonasResiden: '',
                    numeroEbs: '',
                    prestadorPrimario: 'SUMIMEDICAL S.A',
                    codigoFicha: '',
                    nombreEncuestador: '',
                    fechaDiligenciamiento: '',
                    cargoEncuestador: '',
                    usuario: null,
				},
                departamentoItems: [],
                municipioItems: [],
				rules: {
					mayorQueCero: (value) => value > 0 || "El valor debe ser mayor que 0",
					obligatorio: (v) => !!v || "Este campo es obligatorio",
					numero: (value) => !isNaN(value) || "Debe ser un número",

					estratoVivienda: v => {
						if (!v) return 'Este campo es obligatorio';
						const regex = /^[0-9]{1}$/;
						return regex.test(v) || 'El estratoVivienda debe tener 1 dígito';
					},

                    ebs: v => {
						if (!v) return 'Este campo es obligatorio';
						const regex = /^[0-9]{3}$/;
						return regex.test(v) || 'El número EBS debe tener 3 dígitos';
					},

                    nFamilia: v => {
						if (!v) return 'Este campo es obligatorio';
						const regex = /^[0-9]{5}$/;
						return regex.test(v) || 'El número de familia debe tener 5 dígitos';
					}
				},
			};
		},
		created() {
            this.listarDepartamentos();

			this.form.departamento = this.data.departamento;
			this.form.municipioResidencia = this.data.municipioResidencia;
			this.form.direccionEncuestado = this.data.direccionEncuestado;
			this.form.barrioEncuestado = this.data.barrioEncuestado;
            this.form.numeroFamilia = this.data.numeroFamilia;
            this.form.estratoVivienda = this.data.estratoVivienda;
            this.form.numeroHogaresResiden = this.data.numeroHogaresResiden;
            this.form.numeroFamiliasQueResiden = this.data.numeroFamiliasQueResiden;
            this.form.numeroPersonasResiden = this.data.numeroPersonasResiden;
            this.form.numeroEbs = this.data.numeroEbs;
            this.form.codigoFicha = this.data.id;

            if (this.data.fechaDiligenciamiento !== undefined && this.data.fechaDiligenciamiento !== null ) {
                this.form.fechaDiligenciamiento = this.data.fechaDiligenciamiento;
            } else {
                this.form.fechaDiligenciamiento = new Date().toISOString().substr(0, 10);
            }

            this.form.nombreEncuestador = [this.usuario.operador?.nombre, this.usuario.operador?.apellido].filter(Boolean).join(' ') || '';
            this.form.cargoEncuestador = this.usuario.cargo.nombre;

		},
		computed: {
			...mapState('encuesta', ['data', 'informacionGeneral', 'encuesta']),
            ...mapState('auth', ['usuario']),
		},
		methods: {
			...mapMutations('encuesta', ['setModulo',
				'setEncuestaPsicosocial', 'setInformacionGeneral', 'setMorbilidadSentida', 'setCondicionesVivienda',
				'setDatosSeguimiento'
			]),
			...mapActions('encuesta', ['guardarDatos']),

            listarDepartamentos() {
                this.$axios.get("/departamento/").then((res) => {
                    this.departamentoItems = res.data;
                }).catch((error) => {
                    this.$toast.error(error.response.data.mensaje);
                });
            },

            listarMunicipiosResidencia(data) {
                return this.departamentoItems
                .filter((item) => item.id == data)
                .map((municipios) => {
                    return (this.municipioItems = municipios.municipios);
                });
            },

			soloNumeros(event) {
				if (!/[0-9]/.test(event.key)) {
					event.preventDefault();
				}
			},

			guardarInformacionGeneral() {

                this.data.departamento = this.form.departamento;
			    this.data.municipioResidencia = this.form.municipioResidencia;
				this.data.direccionEncuestado = this.form.direccionEncuestado;
				this.data.barrioEncuestado = this.form.barrioEncuestado;
				this.data.direccionEncuestado = this.form.direccionEncuestado;
				this.data.observaciones = this.form.observaciones;
                this.data.numeroFamilia = this.form.numeroFamilia;
                this.data.estratoVivienda = this.form.estratoVivienda;
                this.data.numeroHogaresResiden = this.form.numeroHogaresResiden;
                this.data.numeroFamiliasQueResiden = this.form.numeroFamiliasQueResiden;
                this.data.numeroPersonasResiden = this.form.numeroPersonasResiden;
                this.data.numeroEbs = this.form.numeroEbs;
                this.data.prestadorPrimario = this.form.prestadorPrimario;
                this.data.codigoFicha = this.form.codigoFicha;
                this.data.fechaDiligenciamiento = this.form.fechaDiligenciamiento;
                this.data.nombreEncuestador = this.form.nombreEncuestador;
                this.data.cargoEncuestador = this.form.cargoEncuestador;


				this.setInformacionGeneral({
					...this.form
				});

			},
			scrollToTop() {
				window.scrollTo({
					top: 0,
					behavior: 'smooth'})
			},
			guardar() {
				if (!this.$refs.form) {
					console.error("El formulario no está disponible");
					return;
				}

				if (!this.$refs.form.validate()) {
					this.$toast.error("Por favor, completa todos los campos requeridos.");
					return;
				}

				this.guardarInformacionGeneral();
				this.$emit('siguiente', this.form);
				this.$emit("completado", {
					stan: "InformacionGeneral",
					completo: true
				});
                this.scrollToTop();
			},

		}
	};

</script>
