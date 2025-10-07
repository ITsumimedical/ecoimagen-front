<template>
	<div>
		<v-card :loading="loading" :disabled="loading" elevation="2" class="rounded-lg">
			<v-card-title class="d-flex align-center">
				<img src="/images/ojo.svg" alt="Histórico" height="50" width="50" />
				<span class="ml-3 font-weight-bold text-h6">Histórico de transiciones</span>
			</v-card-title>
			<v-divider></v-divider>

			<v-card-text>
				<v-timeline dense>
					<v-timeline-item v-for="transicion in historicoEvento" :key="transicion.id" color="primary" small>
						<v-card elevation="1" class="pa-3 rounded-lg"
							v-if="transicion.accion === 'Creacion' ? $can('gestion.historico.ver') : true">
							<v-row class="mb-2">
								<v-col cols="8">
									<div class="text-subtitle-2 font-weight-bold">
										<v-icon small left>mdi-check-circle</v-icon>
										{{ transicion.accion }}
									</div>
								</v-col>
								<v-col cols="4" class="text-right">
									<small class="grey--text">
										Registrado por:
										<strong>
											{{
												transicion.usuario?.operador?.nombre ||
													transicion.usuario?.operador?.apellido
													? (transicion.usuario.operador.nombre || '') +
													' ' +
													(transicion.usuario.operador.apellido || '')
													: 'SIN USUARIO'
											}}
										</strong>
									</small>
								</v-col>
							</v-row>

							<v-divider></v-divider>

							<!-- BODY -->
							<v-card-text class="py-2">
								<p><strong>Motivo:</strong> {{ transicion.motivo }}</p>
								<p>
									<strong>Fecha:</strong>
									{{ $moment(transicion.created_at).format('DD/MM/YYYY HH:mm') }}
								</p>

								<template v-if="transicion?.evento?.motivo_anulacion">
									<p>
										<strong>Motivo anulación:</strong>
										{{ transicion?.evento?.motivo_anulacion.nombre || 'No aplica' }}
									</p>
									<p>
										<strong>Clasificación:</strong>
										{{ transicion?.evento?.clasificacion_anulacion || 'No aplica' }}
									</p>
									<p>
										<strong>Otros motivos:</strong>
										{{ transicion?.evento?.otros_motivo_anulacion || 'No aplica' }}
									</p>
								</template>

								<template v-if="transicion?.motivo_asignacion">
									<p>
										<strong>Motivo asignación:</strong>
										{{ transicion?.motivo_asignacion || 'No aplica' }}
									</p>
								</template>
							</v-card-text>
						</v-card>
					</v-timeline-item>
				</v-timeline>

				<v-alert v-if="!loading && historicoEvento.length === 0" type="info" border="left" colored-border
					class="mt-4">
					No hay transiciones registradas para este evento.
				</v-alert>
			</v-card-text>

			<v-card-actions class="justify-end">
				<v-btn color="error" small @click="$emit('cerrarHistorico')">
					<v-icon left small>mdi-close</v-icon> Salir
				</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
export default {
	name: 'WorkspaceJsonHistoricoGestionesEventoComponente',
	props: ['eventoAdverso'],
	data() {
		return {
			historicoEvento: [],
			loading: false,
		}
	},
	mounted() {
		this.listarHistorico()
	},
	methods: {
		listarHistorico() {
			this.loading = true
			this.$axios
				.get('gestion-eventos/historicoGestionEvento/' + this.eventoAdverso)
				.then((res) => {
					this.historicoEvento = res.data
				})
				.catch((error) => {
					console.error(error)
				})
				.finally(() => {
					this.loading = false
				})
		},
	},
}
</script>
