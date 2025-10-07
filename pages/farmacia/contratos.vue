<template>
	<div>
		<v-card elevation="0">
			<v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px"/>
							<span>Contratos de Operador Logístico - Farmacia</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
				</v-toolbar>
			</v-card-title>
			<v-card-text>
				<v-row dense>
					<!-- Buscar Prestador -->
					<v-col cols="12" sm="12" md="10">
						<v-autocomplete dense outlined label="Prestador" v-model="prestador"
						                :items="opcionesPrestadores"
						                item-text="nombre_completo" return-object
						                :search-input.sync="campoBusquedaPrestador"
						                no-data-text="Digite el Nombre o NIT del Prestador para iniciar la búsqueda..."
						                :loading="loading.opcionesPrestadores" @change="listarContratosPrestador">
						</v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="2" align="right">
						<v-btn block dark color="warning" @click="limpiarPrestador">Limpiar</v-btn>
					</v-col>
				</v-row>
				<v-row dense v-if="prestador">
					<v-col cols="12" sm="12" md="12" class="mb-2">
						<v-divider></v-divider>
					</v-col>
					<!-- Contratos -->
					<v-col cols="12" sm="12" md="12">
						<v-alert dense text color="primary" class="text-center" border="left" icon="mdi-file-sign">
							<v-row dense align="center">
								<v-col class="grow">
									<b>Contratos{{ ` - ${prestador?.nombre_prestador} - ${prestador?.nit}` }}</b>
								</v-col>
								<v-col class="shrink d-flex" style="gap: .5rem">
									<v-btn small dark color="success" @click="abrirModalCrearContrato"
									       v-show="$can('farmacia.contratos.crear')">
										Agregar Contrato
										<v-icon right small>mdi-plus-circle-outline</v-icon>
									</v-btn>
								</v-col>
							</v-row>
						</v-alert>
					</v-col>
					<v-col cols="12" sm="12" md="12">
						<v-divider></v-divider>
					</v-col>
					<v-col cols="12" sm="12" md="12">
						<v-data-table dense :headers="headersContratos" :items="contratosPrestador"
						              :loading="loading.contratosPrestador" no-data-text="Sin datos para mostrar"
						              loading-text="Cargando... Por favor espere." hide-default-footer
						              disable-pagination show-expand
						              single-expand @item-expanded="listarTarifasContrato" :expanded.sync="expanded">
							<template v-slot:[`item.fecha_inicio`]="{ item }">
								{{ $moment(item.fecha_inicio).format('DD/MM/YYYY') }}
							</template>
							<template v-slot:[`item.fecha_vigencia`]="{ item }">
								{{ $moment(item.fecha_vigencia).format("DD/MM/YYYY") }}
							</template>
							<template v-slot:[`item.estadoContrato`]="{ item }">
								<v-chip small dark :color="obtenerColorEstado(item.estado_id)">
									{{ item.estado.nombre }}
								</v-chip>
							</template>
							<template v-slot:[`item.acciones`]="{ item }">
								<div style="
                					display: flex;
                					align-items: center;
                					justify-content: center;
                					gap: .4rem;">
									<v-tooltip bottom v-if="$can('farmacia.contratos.editarContrato')">
										<template v-slot:activator="{ on, attrs }">
											<v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
											        @click="abrirModalEditarContrato(item)">
												mdi-pencil
											</v-icon>
										</template>
										<span>Editar Contrato</span>
									</v-tooltip>
									<v-tooltip bottom v-if="$can('farmacia.contratos.agregarTarifa')">
										<template v-slot:activator="{ on, attrs }">
											<v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
											        @click="abrirModalAgregarTarifa(item)">
												mdi-text-box-plus-outline
											</v-icon>
										</template>
										<span>Agregar Tarifa</span>
									</v-tooltip>
									<v-tooltip bottom v-if="$can('farmacia.contratos.cambiarEstadoContrato')">
										<template v-slot:activator="{ on, attrs }">
											<v-icon :color="item.estado_id === 1 ? 'error' : 'success'" class="mr-2"
											        v-bind="attrs" v-on="on"
											        @click="cambiarEstadoContrato(item)">
												{{
													item.estado_id === 1 ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch'
												}}
											</v-icon>
										</template>
										<span>{{ item.estado_id === 1 ? 'Inactivar' : 'Activar' }} Contrato</span>
									</v-tooltip>
									<v-tooltip bottom v-if="$can('farmacia.contratos.verHistoricoNovedades')">
										<template v-slot:activator="{ on, attrs }">
											<v-icon color="blue-grey" class="mr-2" v-bind="attrs" v-on="on"
											        @click="abrirModalVerNovedades(item)">
												mdi-history
											</v-icon>
										</template>
										<span>Ver Histórico de Novedades</span>
									</v-tooltip>
								</div>
							</template>
							<!-- Tarifas del Contrato -->
							<template v-slot:expanded-item>
								<td class="pa-2 elevation-0" colspan="12">
									<v-data-table dense :headers="headersTarifas" :items="tarifasContrato"
									              :loading="loading.tarifasContrato"
									              no-data-text="Sin datos para mostrar" class="elevation-1">
										<template v-slot:[`item.estadoTarifa`]="{ item }">
											<v-chip small dark :color="obtenerColorEstado(item.estado_id)">
												{{ item.estado.nombre }}
											</v-chip>
										</template>
										<template v-slot:[`item.acciones`]="{ item }">
											<div style="
                					display: flex;
                					align-items: center;
                					justify-content: center;
                					gap: .4rem;" v-if="item?.contrato?.estado_id === 1">
												<v-tooltip bottom v-if="$can('farmacia.contratos.editarTarifa')">
													<template v-slot:activator="{ on, attrs }">
														<v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
														        @click="abrirModalEditarTarifa(item)">
															mdi-pencil
														</v-icon>
													</template>
													<span>Editar Tarifa</span>
												</v-tooltip>
												<v-tooltip bottom v-if="$can('farmacia.contratos.gestionarCums')">
													<template v-slot:activator="{ on, attrs }">
														<v-icon color="teal" class="mr-2" v-bind="attrs" v-on="on"
														        @click="abrirModalGestionarCums(item)">
															mdi-medication-outline
														</v-icon>
													</template>
													<span>Gestionar CUM's</span>
												</v-tooltip>
												<v-tooltip bottom v-if="$can('farmacia.contratos.cargueMasivoCums')">
													<template v-slot:activator="{ on, attrs }">
														<v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
														        @click="abrirModalCargueMasivoCums(item)">
															mdi-folder-multiple-plus-outline
														</v-icon>
													</template>
													<span>Cargue Masivo de CUM's</span>
												</v-tooltip>
												<v-tooltip bottom v-if="$can('farmacia.contratos.cambiarEstadoTarifa')">
													<template v-slot:activator="{ on, attrs }">
														<v-icon :color="item.estado_id === 1 ? 'error' : 'success'"
														        class="mr-2" v-bind="attrs"
														        v-on="on" @click="cambiarEstadoTarifa(item)">
															{{
																item.estado_id === 1 ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch'
															}}
														</v-icon>
													</template>
													<span>{{
															item.estado_id === 1 ? 'Inactivar' : 'Activar'
														}} Tarifa</span>
												</v-tooltip>
											</div>
											<div
												style=" display: flex; align-items: center; justify-content: center; gap: .4rem;"
												v-else>
												<v-chip label small dark color="blue-gray">
													Contrato Inactivo
												</v-chip>
											</div>
										</template>
									</v-data-table>
								</td>
							</template>
						</v-data-table>
					</v-col>
					<v-col cols="12" md="12" sm="12" class="mt-2">
						<v-divider></v-divider>
					</v-col>
					<v-col cols="12" md="11" sm="11">
						<v-pagination v-model="paginacion.pagina" :length="paginacion.total" :total-visible="9"
						              @input="listarContratosPrestador()"></v-pagination>
					</v-col>
					<v-col cols="12" md="1" sm="1">
						<v-select dense v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50, 100]" outlined
						          label="Registros por Página" @change="listarContratosPrestador()"></v-select>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>

		<!-- Crear Contrato -->
		<modal-crear-contrato-medicamentos :mostrar-modal-crear-contrato.sync="mostrarModalCrearContrato"
		                                   :prestador-id="prestador?.id" v-if="prestador"
		                                   @recargarDatos="listarContratosPrestador"/>

		<!-- Editar Contrato -->
		<modal-editar-contrato-medicamentos :mostrar-modal-editar-contrato.sync="mostrarModalEditarContrato"
		                                    :contrato-seleccionado="contratoSeleccionado"
		                                    @recargarDatos="listarContratosPrestador"/>

		<!-- Agregar Tarifa -->
		<modal-agregar-tarifa-contrato-medicamentos
			:mostrar-modal-agregar-tarifa-contrato.sync="mostrarModalAgregarTarifa"
			:contrato-seleccionado="contratoSeleccionado"
			@recargarDatos="listarTarifasContrato({ item: contratoSeleccionado, value: true })"/>

		<!-- Ver Novedades del Contrato -->
		<modal-novedades-contrato-farmacia :contrato-seleccionado="contratoSeleccionado"
		                                   :mostrar-modal-novedades-contrato.sync="mostrarModalNovedadesContrato"/>

		<!-- Editar Tarifa -->
		<modal-editar-tarifa-contrato-medicamentos :mostrar-modal-editar-tarifa.sync="mostrarModalEditarTarifa"
		                                           :tarifa-seleccionada="tarifaSeleccionada"
		                                           @recargarDatos="listarTarifasContrato"/>

		<!-- Gestionar CUM's -->
		<modal-gestionar-cums-tarifa :mostrar-modal-gestionar-cums.sync="mostrarModalGestionarCums"
		                             :tarifa-seleccionada="tarifaSeleccionada"/>

		<!-- Cargue Masivo de CUM's -->
		<modal-cargue-masivo-cums-tarifa :mostrar-modal-cargue-masivo-cums.sync="mostrarModalCargueMasivoCums"
		                                 :tarifa-seleccionada="tarifaSeleccionada"/>

	</div>
</template>

<script>
import {mapActions} from "vuex";
import ModalCrearContratoMedicamentos from "@/components/farmacia/contratos/modalCrearContratoMedicamentos.vue";
import ModalAgregarTarifaContratoMedicamentos
	from "~/components/farmacia/contratos/modalAgregarTarifaContratoMedicamentos.vue";
import ModalGestionarCumsTarifa from "~/components/farmacia/contratos/modalGestionarCumsTarifa.vue";
import ModalEditarContratoMedicamentos from "~/components/farmacia/contratos/modalEditarContratoMedicamentos.vue";
import ModalEditarTarifaContratoMedicamentos
	from "~/components/farmacia/contratos/modalEditarTarifaContratoMedicamentos.vue";
import ModalCargueMasivoCumsTarifa from "~/components/farmacia/contratos/modalCargueMasivoCumsTarifa.vue";
import ModalNovedadesContratoFarmacia from "~/components/farmacia/contratos/modalNovedadesContratoFarmacia.vue";

export default {
	middleware({$can, redirect}) {
		if (!$can('farmacia.contratos.vista')) {
			return redirect('/')
		}
	},
	components: {
		ModalNovedadesContratoFarmacia,
		ModalCargueMasivoCumsTarifa,
		ModalEditarTarifaContratoMedicamentos,
		ModalEditarContratoMedicamentos,
		ModalGestionarCumsTarifa,
		ModalAgregarTarifaContratoMedicamentos,
		ModalCrearContratoMedicamentos
	},
	data() {
		return {
			loading: {
				opcionesPrestadores: false,
				contratosPrestador: false,
				tarifasContrato: false
			},
			paginacion: {
				pagina: 1,
				cantidadRegistros: 10,
				total: 0,
			},
			prestador: null,
			campoBusquedaPrestador: null,
			opcionesPrestadores: [],
			headersContratos: [
				{text: "N°", value: "id", align: "center"},
				{text: "Prestador", value: "prestador.nombre_prestador", align: "center"},
				{text: "Entidad", value: "entidad.nombre", align: "center"},
				{text: "Ámbito", value: "ambito.nombre", align: "center"},
				{text: "Fecha Inicio", value: "fecha_inicio", align: "center"},
				{text: "Fecha Vigencia", value: "fecha_vigencia", align: "center"},
				{text: "Estado", value: "estadoContrato", align: "center"},
				{text: "Acciones", value: "acciones", align: "center", sortable: false},
			],
			contratosPrestador: [],
			headersTarifas: [
				{text: "N°", value: "id", align: "center"},
				{text: "Sede", value: "rep.nombre", align: "center"},
				{text: "Manual Tarifario", value: "manual_tarifario.nombre", align: "center"},
				{text: "Estado", value: "estadoTarifa", align: "center"},
				{text: "Acciones", value: "acciones", align: "center", sortable: false},
			],
			tarifasContrato: [],
			mostrarModalCrearContrato: false,
			mostrarModalEditarContrato: false,
			mostrarModalAgregarTarifa: false,
			mostrarModalEditarTarifa: false,
			mostrarModalNovedadesContrato: false,
			contratoSeleccionado: {},
			mostrarModalGestionarCums: false,
			tarifaSeleccionada: {},
			mostrarModalCargueMasivoCums: false,
			expanded: [],
		};
	},
	watch: {
		campoBusquedaPrestador(newValue) {
			if (newValue && newValue.length === 4) {
				this.buscarPrestadores();
			}
		}
	},
	methods: {
		...mapActions("app", ["setPreload"]),

		limpiarPrestador() {
			this.prestador = null;
			this.campoBusquedaPrestador = null;
			this.opcionesPrestadores = [];
			this.contratosPrestador = [];
			this.tarifasContrato = [];
		},

		async buscarPrestadores() {
			try {
				this.loading.opcionesPrestadores = true;
				const params = {
					prestador: this.campoBusquedaPrestador
				}
				const response = await this.$axios.get(
					`/prestador/listar-prestadores-contratos-medicamentos`,
					{params}
				);

				if (response.data.length <= 0) {
					return this.$toast.info('No se han encontrado registros de prestadores con los criterios ingresados.')
				}

				this.opcionesPrestadores = response.data.map(prestador => {
					return {
						nombre_completo: `${prestador.nombre_prestador} - ${prestador.nit} - ${prestador.municipio.departamento.nombre} - ${prestador.municipio.nombre}`,
						...prestador
					}
				});


			} catch (error) {
				if (this.opcionesPrestadores.length <= 0) {
					this.$toast.error('No se han encontrado registros de prestadores con los criterios ingresados')
				} else {
					this.$toast.error("Ocurrió un error al cargar los prestadores");
				}
			} finally {
				this.loading.opcionesPrestadores = false;
			}
		},

		abrirModalCrearContrato() {
			this.mostrarModalCrearContrato = true;
		},

		async listarContratosPrestador() {
			// Reiniciar el array de contratos
			this.contratosPrestador = [];

			this.$set(this, 'expanded', []);
			try {
				this.loading.contratosPrestador = true;

				// Construir la URL con los parámetros
				const url = `/contratos-medicamentos/listar-contratos-prestador?` +
					`pagina=${this.paginacion.pagina}` +
					`&cantidadRegistros=${this.paginacion.cantidadRegistros}` +
					`&prestador=${this.prestador?.id || ''}`;

				// Realizar la solicitud
				const response = await this.$axios.get(url);

				// Procesar la respuesta
				this.contratosPrestador = response.data.data;
				this.paginacion.total = response.data.last_page;
			} catch (error) {
				this.$toast.error(`Ocurrió un error al cargar los contratos de ${this.prestador?.nombre_prestador}`);
			} finally {
				this.loading.contratosPrestador = false;
			}
		},

		obtenerColorEstado(estadoId) {
			switch (estadoId) {
				case 1:
					return 'primary';
				case 2:
					return 'error';
				default:
					return 'grey';
			}
		},

		abrirModalAgregarTarifa(contrato) {
			this.contratoSeleccionado = contrato;
			this.mostrarModalAgregarTarifa = true;
		},

		abrirModalEditarContrato(contrato) {
			this.mostrarModalEditarContrato = true;
			this.contratoSeleccionado = contrato;
		},

		async cambiarEstadoContrato(contrato) {
			try {
				const response = await this.$swal({
					title: "¿Está seguro(a)?",
					text: `¿Desea ${contrato.estado_id === 1 ? 'inactivar' : 'activar'} el contrato? Todas sus tarifas se inactivarán junto con este.`,
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Aceptar",
				});

				if (response.value) {
					this.setPreload(true);

					await this.$axios.patch(`/contratos-medicamentos/cambiar-estado-contrato/${contrato.id}`);

					this.$toast.success("Contrato actualizado con exito");

					await this.listarContratosPrestador();
				}

			} catch (error) {
				this.$toast.error("Ocurrió un error al cambiar el estado del contrato");
			} finally {
				this.setPreload(false);
			}
		},

		abrirModalVerNovedades(contrato) {
			this.contratoSeleccionado = contrato;
			this.mostrarModalNovedadesContrato = true;
		},

		async listarTarifasContrato({item, value}) {
			// Si está colapsado no hacer nada
			if (!value) return;

			// Reiniciar el array de tarifas
			this.tarifasContrato = [];
			try {
				this.loading.tarifasContrato = true;

				// Construir la URL con los parámetros
				const url = `/tarifas-contratos-medicamentos/listar-tarifas-contrato?` +
					`contrato=${item.id}`;

				// Realizar la solicitud
				const response = await this.$axios.get(url);

				// Procesar la respuesta
				this.tarifasContrato = response.data;
			} catch (error) {
				console.log({error})
				this.$toast.error("Ocurrió un error al cargar las tarifas del contrato");
			} finally {
				this.loading.tarifasContrato = false;
			}
		},

		abrirModalGestionarCums(tarifa) {
			this.tarifaSeleccionada = tarifa;
			this.mostrarModalGestionarCums = true;
		},

		abrirModalEditarTarifa(tarifa) {
			this.tarifaSeleccionada = tarifa;
			this.mostrarModalEditarTarifa = true;
		},

		async cambiarEstadoTarifa(tarifa) {
			try {
				const response = await this.$swal({
					title: '¿Está seguro(a)?',
					text: `Desea ${tarifa.estado_id === 1 ? 'inactivar' : 'activar'} la tarifa`,
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Aceptar',
				});

				if (response.value) {
					this.setPreload(true);

					await this.$axios.patch(`/tarifas-contratos-medicamentos/cambiar-estado-tarifa/${tarifa.id}`);

					this.$toast.success('Tarifa actualizada con exito');

					await this.listarTarifasContrato({item: {id: tarifa.contrato_medicamentos_id}, value: true});
				}

			} catch (error) {
				console.log({error});
				this.$toast.error('Ocurrió un error al cambiar el estado de la tarifa');
			} finally {
				this.setPreload(false);
			}
		},

		abrirModalCargueMasivoCums(tarifa) {
			this.tarifaSeleccionada = tarifa;
			this.mostrarModalCargueMasivoCums = true;
		}

	}
};
</script>
