package com.example.arken.fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.example.arken.R;
import com.example.arken.activity.MainActivity;
import com.example.arken.model.GoogleUser;
import com.example.arken.model.SignupUser;
import com.example.arken.util.RetroClient;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GoogleSignupFragment extends Fragment implements View.OnClickListener {
    private String userName;
    private String userSurname;
    private String userEmail;
    private String googleId;
    private Switch isTraderSwitch;
    private Button submitButton;
    private EditText ibanEditText;
    private EditText tcknEditText;

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
        if (view.getId() != R.id.signup_google_iban_editText && view.getId() != R.id.signup_google_tckn_editText){
            InputMethodManager inputMethodManager = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if (view.getId() == R.id.signup_google_submit_button) {

            String location = "Turkey";
            Boolean isTrader = isTraderSwitch.isChecked();
            if (isTrader){
                if (tcknEditText.getText().toString().trim().equals("")) {
                    tcknEditText.setError("Please enter your TC");
                    return;
                }
                if (ibanEditText.getText().toString().trim().equals("")) {
                    ibanEditText.setError("Please enter your iban");
                    return;
                }
            }
            Call<ResponseBody> call;
            if (isTrader) {
                String tckn=String.valueOf(tcknEditText.getText());
                String iban=String.valueOf(ibanEditText.getText());

                call = RetroClient.getInstance().getAPIService().signupGoogle(new GoogleUser(userName,
                        userSurname, userEmail, googleId, location,isTrader,tckn,iban));
            } else {
                call = RetroClient.getInstance().getAPIService().signupGoogle(new GoogleUser(userName,
                        userSurname, userEmail, googleId, location));
            }

            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "You are registered!", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(getContext(), response.raw().toString(), Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
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
}