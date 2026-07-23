<?php

namespace App\Http\Controllers;

use App\Models\DeviceToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeviceTokenController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(['token' => 'required|string']);

        DeviceToken::updateOrCreate(
            ['user_id' => auth()->id(), 'token' => $validated['token']],
            ['token' => $validated['token']],
        );

        return response()->json(['ok' => true]);
    }
}
