<template>
	<div>
		<v-row dense>
			<v-col cols="11" sm="11" md="11">
				<v-alert dense border="left" text :value="true" color="#4527A0" icon="mdi-security">
					<b>Protocolo de londres</b>
				</v-alert>
			</v-col>
			<v-col cols="1" sm="1" md="1" v-if="eventoAdverso.estado_id != 17">
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn text icon color="#4527A0" dark v-on="on" @click="dialogoAccionInsegura = true">
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</template>
					<span>Agregar nueva acción insegura</span>
				</v-tooltip>
			</v-col>
		</v-row>
		<!-- FORMULARIO ACCIONES INSEGURAS -->
		<v-dialog v-model="dialogoAccionInsegura" max-width="600px" persistent>
			<v-card>
				<v-alert text dense border="left" color="#4527A0" icon="mdi-alert-plus-outline">Agregar acción insegura
				</v-alert>
				<v-container>
					<v-row dense>
						<v-col cols="12" sm="12" md="12">
							<v-text-field outlined dense v-model="nuevaAccionInsegura.nombre"
								label="Nombre de la acción insegura">
							</v-text-field>
						</v-col>
						<v-col cols="11" sm="11" md="11">
							<v-autocomplete outlined small-chips dense deletable-chips
								v-model="nuevaAccionInsegura.condiciones_paciente" :items="condiciones_paciente"
								label="Condiciones del paciente" multiple chips>
							</v-autocomplete>
						</v-col>
						<v-col cols="1" sm="1" md="1">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn text icon color="#4527A0" dark v-on="on"
										@click="dialogoCampo('Condiciones del paciente')">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span>Nueva condición del paciente</span>
							</v-tooltip>
						</v-col>
						<v-col cols="11" sm="11" md="11">
							<v-autocomplete outlined small-chips dense deletable-chips
								v-model="nuevaAccionInsegura.metodos" :items="metodos_procesos" label="Metodos/Procesos"
								multiple chips>
							</v-autocomplete>
						</v-col>
						<v-col cols="1" sm="1" md="1">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn text icon color="#4527A0" dark v-on="on"
										@click="dialogoCampo('Metodos/Procesos')">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span>Nuevo método o proceso</span>
							</v-tooltip>
						</v-col>
						<v-col cols="11" sm="11" md="11">
							<v-autocomplete outlined small-chips dense deletable-chips
								v-model="nuevaAccionInsegura.colaborador" :items="colaboradores" label="Colaborador"
								multiple chips>
							</v-autocomplete>
						</v-col>
						<v-col cols="1" sm="1" md="1">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn text icon color="#4527A0" dark v-on="on"
										@click="dialogoCampo('Colaborador')">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span>Nuevo colaborador</span>
							</v-tooltip>
						</v-col>
						<v-col cols="11" sm="11" md="11">
							<v-autocomplete outlined small-chips dense deletable-chips
								v-model="nuevaAccionInsegura.equipo_trabajo" :items="equipo_trabajo"
								label="Equipo de trabajo" multiple chips>
							</v-autocomplete>
						</v-col>
						<v-col cols="1" sm="1" md="1">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn text icon color="#4527A0" dark v-on="on"
										@click="dialogoCampo('Equipo de trabajo')">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span>Nuevo equipo de trabajo</span>
							</v-tooltip>
						</v-col>
						<v-col cols="11" sm="11" md="11">
							<v-autocomplete outlined small-chips dense deletable-chips
								v-model="nuevaAccionInsegura.ambiente" :items="ambientes" label="Ambiente" multiple
								chips>
							</v-autocomplete>
						</v-col>
						<v-col cols="1" sm="1" md="1">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn text icon color="#4527A0" dark v-on="on" @click="dialogoCampo('Ambiente')">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span>Nuevo ambiente</span>
							</v-tooltip>
						</v-col>
						<v-col cols="11" sm="11" md="11">
							<v-autocomplete outlined small-chips dense deletable-chips
								v-model="nuevaAccionInsegura.recursos" :items="recursos"
								label="Recursos/Materiales/Insumos" multiple chips>
							</v-autocomplete>
						</v-col>
						<v-col cols="1" sm="1" md="1">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn text icon color="#4527A0" dark v-on="on"
										@click="dialogoCampo('Recursos/Materiales/Insumos')">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span>Nuevo recursos</span>
							</v-tooltip>
						</v-col>
						<v-col cols="11" sm="11" md="11">
							<v-autocomplete outlined small-chips dense deletable-chips
								v-model="nuevaAccionInsegura.contexto" :items="contexto_institucional"
								label="Contexto institucional" multiple chips>
							</v-autocomplete>
						</v-col>
						<v-col cols="1" sm="1" md="1">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn text icon color="#4527A0" dark v-on="on"
										@click="dialogoCampo('Contexto institucional')">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</template>
								<span>Nuevo contexto</span>
							</v-tooltip>
						</v-col>
					</v-row>
				</v-container>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn small color="error" @click="cerrarDialogoAccionInsegura()">Cancelar</v-btn>
					<v-btn small color="success" @click="guardarAccionInsegura()">Guardar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialogItems" max-width="500px">
			<v-card>
				<v-card-title>
					<v-toolbar flat>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px" />
							<b>{{ campo }}</b>
						</div>
						<v-divider class="mx-4" inset vertical></v-divider>
					</v-toolbar>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogItems = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>


				<v-card-text>
					<v-alert dense text type="info" border="left" colored-border icon="mdi-information-outline"
						class="mb-4">
						Recuerda presionar <strong>Enter</strong> después de escribir el nuevo valor
						para que se agregue correctamente.
					</v-alert>

					<v-combobox outlined dense small-chips deletable-chips multiple chips v-model="nuevosItems"
						:items="[]" hint="Escriba el campo que desea añadir a la lista." persistent-hint></v-combobox>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" small @click="dialogItems = false">
						Cancelar
					</v-btn>
					<v-btn color="success" dark small @click="agregarItems">
						Agregar
						<v-icon right>mdi-check</v-icon>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- ACCIONES INSEGURAS REGISTRADAS -->
		<v-expansion-panels>
			<v-expansion-panel v-for="(item, i) in accionesInseguraEvento" :key="i">
				<v-expansion-panel-header color="#EDE7F6" style="text-transform:uppercase">
					<template v-slot:actions>
						<v-icon color="#7E57C2">
							mdi-chevron-down-circle-outline
						</v-icon>
					</template>
					<b style="color:#7E57C2">{{ item.nombre }}</b>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<br>
					<v-container>
						<v-row dense>
							<v-col cols="12" sm="12" md="12">
								<v-text-field outlined v-model="item.nombre" dense label="Nombre"></v-text-field>
							</v-col>
							<v-col cols="12" sm="11" md="11">
								<v-autocomplete outlined small-chips dense deletable-chips
									v-model="item.condiciones_paciente" :items="condiciones_paciente"
									label="Condiciones del paciente" multiple chips>
								</v-autocomplete>
							</v-col>
							<v-col cols="1" sm="1" md="1">
								<v-tooltip top>
									<template v-slot:activator="{ on }">
										<v-btn text icon color="#4527A0" dark v-on="on"
											@click="dialogoCampo('Condiciones del paciente')">
											<v-icon>mdi-plus</v-icon>
										</v-btn>
									</template>
									<span>Nuevo método o proceso</span>
								</v-tooltip>
							</v-col>
							<v-col cols="12" sm="11" md="11">
								<v-autocomplete outlined small-chips dense deletable-chips v-model="item.metodos"
									:items="metodos_procesos" label="Metodos/Procesos" multiple chips>
								</v-autocomplete>
							</v-col>
							<v-col cols="1" sm="1" md="1">
								<v-tooltip top>
									<template v-slot:activator="{ on }">
										<v-btn text icon color="#4527A0" dark v-on="on"
											@click="dialogoCampo('Metodos/Procesos')">
											<v-icon>mdi-plus</v-icon>
										</v-btn>
									</template>
									<span>Nuevo método o proceso</span>
								</v-tooltip>
							</v-col>
							<v-col cols="12" sm="11" md="11">
								<v-autocomplete outlined small-chips dense deletable-chips v-model="item.colaborador"
									:items="colaboradores" label="Colaborador" multiple chips>
								</v-autocomplete>
							</v-col>
							<v-col cols="1" sm="1" md="1">
								<v-tooltip top>
									<template v-slot:activator="{ on }">
										<v-btn text icon color="#4527A0" dark v-on="on"
											@click="dialogoCampo('Colaborador')">
											<v-icon>mdi-plus</v-icon>
										</v-btn>
									</template>
									<span>Nuevo método o proceso</span>
								</v-tooltip>
							</v-col>

							<v-col cols="12" sm="11" md="11">
								<v-autocomplete outlined small-chips dense deletable-chips v-model="item.equipo_trabajo"
									:items="equipo_trabajo" label="Equipo de trabajo" multiple chips>
								</v-autocomplete>
							</v-col>
							<v-col cols="1" sm="1" md="1">
								<v-tooltip top>
									<template v-slot:activator="{ on }">
										<v-btn text icon color="#4527A0" dark v-on="on"
											@click="dialogoCampo('Equipo de trabajo')">
											<v-icon>mdi-plus</v-icon>
										</v-btn>
									</template>
									<span>Nuevo método o proceso</span>
								</v-tooltip>
							</v-col>
							<v-col cols="12" sm="11" md="11">
								<v-autocomplete outlined small-chips dense deletable-chips v-model="item.ambiente"
									:items="ambientes" label="Ambiente" multiple chips>
								</v-autocomplete>
							</v-col>
							<v-col cols="1" sm="1" md="1">
								<v-tooltip top>
									<template v-slot:activator="{ on }">
										<v-btn text icon color="#4527A0" dark v-on="on"
											@click="dialogoCampo('Ambiente')">
											<v-icon>mdi-plus</v-icon>
										</v-btn>
									</template>
									<span>Nuevo método o proceso</span>
								</v-tooltip>
							</v-col>
							<v-col cols="12" sm="11" md="11">
								<v-autocomplete outlined small-chips dense deletable-chips v-model="item.recursos"
									:items="recursos" label="Recursos/Materiales/Insumos" multiple chips>
								</v-autocomplete>
							</v-col>
							<v-col cols="1" sm="1" md="1">
								<v-tooltip top>
									<template v-slot:activator="{ on }">
										<v-btn text icon color="#4527A0" dark v-on="on"
											@click="dialogoCampo('Recursos/Materiales/Insumos')">
											<v-icon>mdi-plus</v-icon>
										</v-btn>
									</template>
									<span>Nuevo método o proceso</span>
								</v-tooltip>
							</v-col>
							<v-col cols="12" sm="11" md="11">
								<v-autocomplete outlined small-chips dense deletable-chips v-model="item.contexto"
									:items="contexto_institucional" label="Contexto institucional" multiple chips>
								</v-autocomplete>
							</v-col>
							<v-col cols="1" sm="1" md="1">
								<v-tooltip top>
									<template v-slot:activator="{ on }">
										<v-btn text icon color="#4527A0" dark v-on="on"
											@click="dialogoCampo('Contexto institucional')">
											<v-icon>mdi-plus</v-icon>
										</v-btn>
									</template>
									<span>Nuevo método o proceso</span>
								</v-tooltip>
							</v-col>
						</v-row>
					</v-container>
					<v-card-actions v-if="eventoAdverso.estado_id != 17">
						<v-spacer></v-spacer>
						<v-btn color="error" small @click="eliminarRegistro(item)">Eliminar<v-icon
								right>mdi-delete</v-icon></v-btn>
						<v-btn color="success" small @click="actualizarAccionInsegura()">
							Actualizar protocolo
							<v-icon right>mdi-update</v-icon>
						</v-btn>
					</v-card-actions>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script>
import {
	mapActions
} from "vuex";
export default {
	name: 'WorkspaceJsonAccionInseguraComponente',

	props: {
		eventoAdverso: {
			type: Object,
			default: () => ({})
		}
	},

	data() {
		return {
			dialogoAccionInsegura: false,
			dialogItems: false,
			nuevosItems: [],
			campo: '',
			nuevaAccionInsegura: {},
			accion_inseguras: [],
			accionesInseguraEvento: [],
			accionInsegura: {
				nombre: '',
				analisis_evento_id: '',
				condiciones_paciente: '',
			},
			condiciones_paciente: ['No aplica', 'Condiciones anatomofisiologicas', 'Patologia en curso', 'Edad',
				'Su lenguaje y comunicacion', 'No dherencia al tratamiento indicado',
				'No adherencia a las normas y recomendaciones',
			],
			metodos_procesos: ['No aplica', 'No existen procesos documentados',
				'Los procesos documentados no son claros y/o no se adaptan a la dinamica intitucional',
				'No adherencia a los procesos documentados',
				'El sistema de la institucion limita la ejecucion de los procesos',
			],
			colaboradores: ['No aplica', 'Desconocimiento', 'Falta de habilidades', 'Debilidad de competencias',
				'No adherencia a los lineamientos establecidos', 'Lapsus, distraccion',
			],
			equipo_trabajo: ['No aplica', 'Falta de capacitacion o entrenamiento al equipo',
				'Fallas en la comunicacion (comunicacion inefectiva)',
				'Falta de liderazgo y/o supervision de quien lidera el proceso',
				'El equipo no se encuentra adecuadamente estructurado para la ejecucion de los procesos',
				'No se encuentran definidas las tareas entre los miebros del equipo',
			],
			ambientes: ['No aplica', 'Insuficiencia del personal', 'Sobrecarga laboral / cansancio / estres',
				'Inadecuada distribucion de turnos', 'Clima laboral',
				'Ambiente fisico (iluminacion inadecuada, contaminacion visual o auditiva, obstaculos en los pasillos)',
			],
			recursos: ['No aplica', 'No se han solicitado los recursos necesarios',
				'No asignacion del recurso por parte de la institucion', 'Recursos financieros limitados',
				'No disponibilidad de medicamento / dispositivo medico / reactivo',
				'Medicamento / dispositivo médico / reactivo vencido',
				'Mal uso de medicamento / dispositivo medico / reactivo',
			],
			contexto_institucional: ['No aplica', 'Decisiones gerenciales',
				'No estan definidas las políticas para la operativizacion de los procesos',
				'Desconocimento de las politicas establecidas', 'Percepción de falta de cultura organizacional',
			],
		};
	},

	mounted() {
		this.listarAccionesInseguras()
	},

	methods: {
		...mapActions("app", ["setPreload"]),

		guardarAccionInsegura(item) {
			this.setPreload(true);
			this.nuevaAccionInsegura.analisis_evento_id = this.eventoAdverso.analisis_evento.id;
			this.$axios.post("/accion-insegura-eventos/crear", this.nuevaAccionInsegura).then((res) => {
				this.nuevaAccionInsegura = {};
				this.$toast.success("Acción guardada con exito!");
				this.listarAccionesInseguras()
				this.cerrarDialogoAccionInsegura();
				this.$emit('protocoloRegistrado')
			}).catch((error) => {
				console.log(error)
			}).finally(() => {
				this.setPreload(false);
			})
		},

		dialogoCampo(item) {
			this.dialogItems = true;
			this.campo = item;
		},

		agregarItems() {
			if (this.nuevosItems.length <= 0) return;
			if (this.campo == "Condiciones del paciente") {
				this.nuevosItems.forEach((ni) => {
					this.condiciones_paciente.push(ni);
					this.$toast.success('Agregado con éxito');
				});
				this.nuevosItems = [];
			}
			if (this.campo == "Metodos/Procesos") {
				this.nuevosItems.forEach((ni) => {
					this.metodos_procesos.push(ni);
					this.$toast.success('Agregado con éxito');
				});
				this.nuevosItems = [];
			}
			if (this.campo == "Colaborador") {
				this.nuevosItems.forEach((ni) => {
					this.colaboradores.push(ni);
					this.$toast.success('Agregado con éxito');
				});
				this.nuevosItems = [];
			}
			if (this.campo == "Equipo de trabajo") {
				this.nuevosItems.forEach((ni) => {
					this.equipo_trabajo.push(ni);
					this.$toast.success('Agregado con éxito');
				});
				this.nuevosItems = [];
			}
			if (this.campo == "Ambiente") {
				this.nuevosItems.forEach((ni) => {
					this.ambientes.push(ni);
					this.$toast.success('Agregado con éxito');
				});
				this.nuevosItems = [];
			}
			if (this.campo == "Recursos/Materiales/Insumos") {
				this.nuevosItems.forEach((ni) => {
					this.recursos.push(ni);
					this.$toast.success('Agregado con éxito');
				});
				this.nuevosItems = [];
			}
			if (this.campo == "Contexto institucional") {
				this.nuevosItems.forEach((ni) => {
					this.contexto_institucional.push(ni);
					this.$toast.success('Agregado con éxito');
				});
				this.nuevosItems = [];
			}
			this.dialogItems = false;
		},

		listarAccionesInseguras() {
			this.$axios.get('/accion-insegura-eventos/' + this.eventoAdverso.analisis_evento.id).then(res => {
				this.accionesInseguraEvento = res.data
				res.data.forEach(e => {
					if (e.condiciones_paciente) {
						e.condiciones_paciente.forEach(s => {
							if (!this.condiciones_paciente.includes(s)) {
								this.condiciones_paciente.push(s)
							}
						})
					}
					if (e.metodos) {
						e.metodos.forEach(s => {
							if (!this.metodos_procesos.includes(s)) {
								this.metodos_procesos.push(s)
							}
						})
					}
					if (e.colaborador) {
						e.colaborador.forEach(s => {
							if (!this.colaboradores.includes(s)) {
								this.colaboradores.push(s)
							}
						})
					}
					if (e.equipo_trabajo) {
						e.equipo_trabajo.forEach(s => {
							if (!this.equipo_trabajo.includes(s)) {
								this.equipo_trabajo.push(s)
							}
						})
					}
					if (e.ambiente) {
						e.ambiente.forEach(s => {
							if (!this.ambientes.includes(s)) {
								this.ambientes.push(s)
							}
						})
					}
					if (e.recursos) {
						e.recursos.forEach(s => {
							if (!this.recursos.includes(s)) {
								this.recursos.push(s)
							}
						})
					}
					if (e.contexto) {
						e.contexto.forEach(s => {
							if (!this.contexto_institucional.includes(s)) {
								this.contexto_institucional.push(s)
							}
						})
					}
				})
			}).catch(e => {
				console.log(e.response.data);
			})
		},

		actualizarAccionInsegura() {
			this.setPreload(true);
			this.$axios.put('/accion-insegura-eventos/' + this.accionesInseguraEvento[0].id, this.accionesInseguraEvento[0])
				.then(res => {
					this.$toast.success('Se ha actualizado el protocolo de londres correctamente!.')
				}).catch(e => {
					console.log(e.response.data);
				}).finally(() => {
					this.setPreload(false);
				})
		},

		eliminarRegistro(item) {
			this.setPreload(true);
			this.$axios.post(`/accion-insegura-eventos/${item.id}/eliminar`).then((response) => {
				this.$toast.success(response.data.mensaje);
				this.listarAccionesInseguras();
				this.$emit('protocoloRegistrado');
			})
				.catch((error) => {
					this.$toast.error(error.response.data.mensaje || 'Error al actualizar');
				}).finally(() => {
					this.setPreload(false);
				});
		},

		cerrarDialogoAccionInsegura() {
			this.nuevaAccionInsegura = {}
			this.dialogoAccionInsegura = false
		}
	},
};

</script>
