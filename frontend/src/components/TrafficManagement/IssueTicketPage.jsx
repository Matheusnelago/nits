import { useState } from 'react'
import {
  Plus, Car, FileText, MapPin, DollarSign,
  AlertTriangle, Save, RefreshCw, CheckCircle, MapPinned
} from 'lucide-react'
import { issueTicket, getViolationTypes, getNamibianRegions } from '../../Axios'

export default function IssueTicketPage() {
  // Form state
  const [formData, setFormData] = useState({
    plate_no: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_color: '',
    vehicle_year: '',
    violation_type: 'speeding',
    amount: '',
    location: '',
    road_number: '',
    road_type: '',
    region: '',
    gps_coordinates: '',
    officer_notes: '',
    violation_date: '',
    violation_time: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [activeStep, setActiveStep] = useState(1)

  // Get violation types and regions
  const violationTypes = getViolationTypes()
  const regions = getNamibianRegions()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Auto-fill amount based on violation type
    if (name === 'violation_type') {
      const violation = violationTypes.data.find(v => v.code === value)
      if (violation) {
        setFormData(prev => ({ ...prev, amount: violation.fine }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await issueTicket(formData)
      if (result.success) {
        setSuccess({
          ticketNumber: result.ticket_number,
          message: 'Ticket issued successfully!'
        })
        // Reset form
        setFormData({
          plate_no: '',
          vehicle_make: '',
          vehicle_model: '',
          vehicle_color: '',
          vehicle_year: '',
          violation_type: 'speeding',
          amount: '',
          location: '',
          road_number: '',
          road_type: '',
          region: '',
          gps_coordinates: '',
          officer_notes: '',
          violation_date: '',
          violation_time: ''
        })
        setActiveStep(1)
      } else {
        setError(result.error || 'Failed to issue ticket')
      }
    } catch (err) {
      setError('An error occurred while issuing the ticket')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Vehicle Info', icon: Car },
    { id: 2, title: 'Violation Details', icon: AlertTriangle },
    { id: 3, title: 'Location', icon: MapPin },
    { id: 4, title: 'Review & Issue', icon: FileText }
  ]

  return (
    <div className="space-y-6 overflow-hidden min-h-0">
      {/* Header */}
      <div className="rounded-xl border p-6 shrink-0 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Plus className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Issue Traffic Ticket</h1>
            <p className="text-sm mt-1 text-gray-600 dark:text-slate-400">
              Record a new traffic violation and issue a fine
            </p>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="rounded-xl border p-4 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center shrink-0">
              <button
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeStep === step.id
                    ? 'bg-blue-500 text-white'
                    : activeStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {activeStep > step.id ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 shrink-0 ${
                  activeStep > step.id
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-slate-600'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Vehicle Info */}
          {activeStep === 1 && (
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Plate Number *
                  </label>
                  <input
                    type="text"
                    name="plate_no"
                    value={formData.plate_no}
                    onChange={handleChange}
                    required
                    placeholder="NLD-12345"
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Vehicle Year
                  </label>
                  <input
                    type="text"
                    name="vehicle_year"
                    value={formData.vehicle_year}
                    onChange={handleChange}
                    placeholder="2024"
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Vehicle Make *
                  </label>
                  <input
                    type="text"
                    name="vehicle_make"
                    value={formData.vehicle_make}
                    onChange={handleChange}
                    required
                    placeholder="Toyota"
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleChange}
                    required
                    placeholder="Corolla"
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Vehicle Color
                  </label>
                  <input
                    type="text"
                    name="vehicle_color"
                    value={formData.vehicle_color}
                    onChange={handleChange}
                    placeholder="Silver"
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Next Step
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Violation Details */}
          {activeStep === 2 && (
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Violation Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Violation Type *
                  </label>
                  <select
                    name="violation_type"
                    value={formData.violation_type}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {violationTypes.data?.map(violation => (
                      <option key={violation.code} value={violation.code}>
                        {violation.name} - N${violation.fine}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Fine Amount (NAD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400" />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      placeholder="500"
                      className="pl-10 pr-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Violation Date
                  </label>
                  <input
                    type="date"
                    name="violation_date"
                    value={formData.violation_date}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Violation Time
                  </label>
                  <input
                    type="time"
                    name="violation_time"
                    value={formData.violation_time}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Officer Notes
                  </label>
                  <textarea
                    name="officer_notes"
                    value={formData.officer_notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Additional details about the violation..."
                    className="px-4 py-2.5 rounded-lg w-full resize-none bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-2.5 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Next Step
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {activeStep === 3 && (
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Location Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Location Description *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="Near Shopping Centre, Main Street"
                      className="pl-10 pr-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Road Number
                  </label>
                  <input
                    type="text"
                    name="road_number"
                    value={formData.road_number}
                    onChange={handleChange}
                    placeholder="B1"
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Road Type
                  </label>
                  <select
                    name="road_type"
                    value={formData.road_type}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select road type</option>
                    <option value="national">National Road (B1, B2, B3)</option>
                    <option value="district">District Road (M1, M2)</option>
                    <option value="urban">Urban Road</option>
                    <option value="street">Street</option>
                    <option value="avenue">Avenue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    Region
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select region</option>
                    {regions.data?.map(region => (
                      <option key={region.code} value={region.code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    GPS Coordinates
                  </label>
                  <div className="relative">
                    <MapPinned className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-slate-400" />
                    <input
                      type="text"
                      name="gps_coordinates"
                      value={formData.gps_coordinates}
                      onChange={handleChange}
                      placeholder="-22.5597, 17.0832"
                      className="pl-10 pr-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-2.5 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Review Ticket
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Issue */}
          {activeStep === 4 && (
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Review & Issue Ticket</h2>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="text-green-500 font-medium">{success.message}</span>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Ticket Number: <span className="font-mono font-bold">{success.ticketNumber}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Review Summary */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Ticket Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Plate Number</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.plate_no || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Vehicle</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.vehicle_make} {formData.vehicle_model}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Fine Amount</span>
                    <p className="font-medium text-green-500">N${formData.amount || '0'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Violation</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {violationTypes.data?.find(v => v.code === formData.violation_type)?.name || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Location</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.location || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Region</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {regions.data?.find(r => r.code === formData.region)?.name || '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Issue Ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

