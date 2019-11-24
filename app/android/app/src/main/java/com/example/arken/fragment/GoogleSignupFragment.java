package com.example.arken.fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Switch;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.example.arken.R;
import com.example.arken.activity.MainActivity;
import com.example.arken.activity.MapsActivity;
import com.example.arken.model.GoogleUser;
import com.example.arken.model.User;
import com.example.arken.util.RetroClient;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.content.Context.MODE_PRIVATE;
import static com.example.arken.fragment.LoginFragment.MY_PREFS_NAME;

public class GoogleSignupFragment extends Fragment implements View.OnClickListener {
    private String userName;
    private String userSurname;
    private String userEmail;
    private String googleId;
    private Switch isTraderSwitch;
    private Button submitButton;
    private EditText ibanEditText;
    private EditText tcknEditText;
    private Switch isPrivateSwitch;
    private ImageButton locationButton;
    private final int MAPS_ACTIVITY = 3;
    private EditText locationEditText;

    @SuppressLint("ClickableViewAccessibility")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_signup_google, container, false);
        GoogleSignInAccount alreadyloggedAccount = GoogleSignIn.getLastSignedInAccount(getContext());
        userName = alreadyloggedAccount.getGivenName();
        userSurname = alreadyloggedAccount.getFamilyName();
        userEmail = alreadyloggedAccount.getEmail();
        googleId = alreadyloggedAccount.getId();
        ibanEditText = view.findViewById(R.id.signup_google_iban_editText);
        tcknEditText = view.findViewById(R.id.signup_google_tckn_editText);
        ConstraintLayout layout = view.findViewById(R.id.signup_google_background);
        layout.setOnClickListener(this);
        submitButton = view.findViewById(R.id.signup_google_submit_button);
        submitButton.setOnClickListener(this);
        isTraderSwitch = view.findViewById(R.id.signup_google_isTrader_switch);
        locationButton = view.findViewById(R.id.signup_google_location_button);
        locationEditText = view.findViewById(R.id.google_location_editText);
        locationButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(getActivity(), MapsActivity.class);
                startActivityForResult(intent, MAPS_ACTIVITY);
            }
        });
        isPrivateSwitch = view.findViewById(R.id.google_isPublic_switch);
        isTraderSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    ibanEditText.setVisibility(View.VISIBLE);
                    tcknEditText.setVisibility(View.VISIBLE);
                } else {
                    ibanEditText.setVisibility(View.GONE);
                    tcknEditText.setVisibility(View.GONE);
                }
            }
        });

        return view;
    }

    @Override
    public void onClick(View view) {
        if (view.getId() != R.id.signup_google_iban_editText && view.getId() != R.id.signup_google_tckn_editText) {
            InputMethodManager inputMethodManager = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if (view.getId() == R.id.signup_google_submit_button) {

            String location = String.valueOf(locationEditText.getText());
            Boolean isTrader = isTraderSwitch.isChecked();
            if (isTrader) {
                if (tcknEditText.getText().toString().trim().equals("")) {
                    tcknEditText.setError("Please enter your TC");
                    return;
                }
                if (ibanEditText.getText().toString().trim().equals("")) {
                    ibanEditText.setError("Please enter your iban");
                    return;
                }
            }
            boolean isPrivate = !isPrivateSwitch.isChecked();
            Call<User> call;
            if (isTrader) {
                String tckn = String.valueOf(tcknEditText.getText());
                String iban = String.valueOf(ibanEditText.getText());

                call = RetroClient.getInstance().getAPIService().signupGoogle(new GoogleUser(userName,
                        userSurname, userEmail, googleId, location, isTrader, tckn, iban, isPrivate));
            } else {
                call = RetroClient.getInstance().getAPIService().signupGoogle(new GoogleUser(userName,
                        userSurname, userEmail, googleId, location, isPrivate));
            }

            call.enqueue(new Callback<User>() {
                @Override
                public void onResponse(Call<User> call, Response<User> response) {
                    if (response.isSuccessful()) { //events
                        User pr = response.body();
                        SharedPreferences.Editor editor = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).edit();
                        editor.putString("userId",pr.get_id());
                        String cookie = response.headers().get("Set-Cookie");
                        editor.putString("user_cookie", cookie.split(";")[0]);
                        editor.commit();
                        Navigation.findNavController(submitButton).navigate(R.id.action_googleSignupFragment_to_baseFragment);
                    } else {
                        Toast.makeText(getContext(), response.raw().toString(), Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<User> call, Throwable t) {
                    Toast.makeText(getContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        MainActivity.getClient().revokeAccess();

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (resultCode == Activity.RESULT_OK) {
            if (requestCode == MAPS_ACTIVITY) {
                String location = data.getExtras().getString("location");
                locationEditText.setText(location);
            }
        }
    }
}