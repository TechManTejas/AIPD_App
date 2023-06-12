import React, { useEffect, useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import axios from 'axios'
import { post$patient_exercise } from '../../../APIs/DoctorAPI'

export const ExerciseCard: React.FC<{ exercise: string, individualExercise : boolean }> = ({ exercise, individualExercise }) => {

    const [sets, setsets] = useState(2)
    const [reps, setreps] = useState(2)

    useEffect(() => {
        if(individualExercise)
            post$patient_exercise({sets, reps, exercise})
    }, [individualExercise])

    return (
        <div>
            <div className="text-sm">
                {exercise}
            </div>
            <div className="flex gap-3 p-3">
                <div className="flex space-x-2">
                    <TextField fullWidth label="Sets"
                        type="number"
                        value={sets}
                        onChange={(e) => {
                            setsets(parseInt(e.target.value))
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <>
                                        <IconButton onClick={() => { setsets(sets + 1) }}>
                                            +
                                        </IconButton>
                                        <IconButton onClick={() => { setsets(sets - 1) }}>
                                            -
                                        </IconButton>
                                    </>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className="flex space-x-2">
                    <TextField fullWidth label="Reps"
                        type="number"
                        value={reps}
                        onChange={(e) => {
                            setreps(parseInt(e.target.value))
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <>
                                        <IconButton onClick={() => { setreps(reps + 1) }}>
                                            +
                                        </IconButton>
                                        <IconButton onClick={() => { setreps(reps - 1) }}>
                                            -
                                        </IconButton>
                                    </>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
