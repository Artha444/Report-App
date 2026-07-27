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

        // ponytail: keep only latest token per user to avoid duplicate notifications
        DeviceToken::where('user_id', auth()->id())
            ->where('token', '!=', $validated['token'])
            ->delete();

        DeviceToken::updateOrCreate(
            ['token' => $validated['token']],
            ['user_id' => auth()->id()],
        );

        return response()->json(['ok' => true]);
    }
}
